const express = require('express');
const axios = require('axios');
const router = express.Router();
const { fetchWeatherApi } = require('openmeteo');
const { WeatherHistory } = require('../utilities/weather-helper.js');

// Retrieve weather data for a specific city
/** EXPLANATION
 * router.get FUNCTION
 * @param {string} path - The path for the route.
 * @param {function} callback - The function to handle the request.
 * 
 * LAMBDA FUNCTION
 * @param {Object} req - The request object containing city data.
 * @param {Object} res - The response object used to send a response.
 * @return {Object} - The response object containing the weather data or error message.
 */

async function cityToLatLong(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    console.log(`In cityToLatLong: Fetching latitude and longitude for city: ${city}`); // For debugging purposes
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    console.log(`In cityToLatLong: URL constructed: ${url}`); // For debugging purposes
    const response = await axios.get(url);
    console.log(`In cityToLatLong: Response received: ${JSON.stringify(response.data)}`); // For debugging purposes
    if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: lat, longitude: lon };
    } else {
        throw new Error('City not found');
    }
}

function decodeWeatherData(responses) {
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const daily = response.daily();

    const sunrise = daily.variables(2);
    const sunset = daily.variables(3);

    const weatherData = {
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(0).valuesArray(),
            temperature2mMin: daily.variables(1).valuesArray(),
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            rainSum: daily.variables(4).valuesArray(),
            snowfallSum: daily.variables(5).valuesArray(),
            temperature2mMean: daily.variables(6).valuesArray(),
        },
    };
    return weatherData;
};

router.get('/:city/:period', async (req, res) => {
    console.log(`Fetching weather history for city: ${req.params.city} and period: ${req.params.period}`); //For debugging purposes
    const { latitude, longitude } = await cityToLatLong(req.params.city);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); //For debugging purposes
    const [startDate, endDate] = req.params.period.split('_');
    console.log(`Start Date: ${startDate}, End Date: ${endDate}`); //For debugging purposes
    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": startDate,
        "end_date": endDate,
        "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "rain_sum", "snowfall_sum", "temperature_2m_mean"],
        "timezone": "auto"
    };
    const url = "https://archive-api.open-meteo.com/v1/archive";
    try {
        const responses = await fetchWeatherApi(url, params);
        const weatherRawData = new WeatherHistory(decodeWeatherData(responses));
        res.json(weatherRawData.getAlerts());
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;