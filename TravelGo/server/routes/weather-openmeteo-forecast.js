const express = require('express');
const axios = require('axios');
const router = express.Router();
const { fetchWeatherApi } = require('openmeteo');
const { WeatherForecast } = require('../utilities/weather-helper.js');

const params = {
    "latitude": null,
    "longitude": null,
    "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "uv_index_max", "rain_sum", "apparent_temperature_max", "apparent_temperature_min", "wind_speed_10m_max"],
    "current": ["weather_code", "temperature_2m", "relative_humidity_2m", "apparent_temperature", "rain", "cloud_cover", "snowfall"],
    "timezone": "auto",
    "forecast_days": 16,
	"forecast_hours": 24
};
const url = "https://api.open-meteo.com/v1/forecast";

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
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    const response = await axios.get(url);
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

    const current = response.current();
    const daily = response.daily();

    const sunrise = daily.variables(2);
    const sunset = daily.variables(3);

    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            weatherCode: current.variables(0).value(),
            temperature2m: current.variables(1).value(),
            relativeHumidity2m: current.variables(2).value(),
            apparentTemperature: current.variables(3).value(),
            rain: current.variables(4).value(),
            cloudCover: current.variables(5).value(),
            snowfall: current.variables(6).value(),
        },
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
            uvIndexMax: daily.variables(4).valuesArray(),
            rainSum: daily.variables(5).valuesArray(),
            apparentTemperatureMax: daily.variables(6).valuesArray(),
            apparentTemperatureMin: daily.variables(7).valuesArray(),
            windSpeed10mMax: daily.variables(8).valuesArray(),
        },
    };

    /* To log    
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.temperature2m[i],
            weatherData.hourly.rain[i],
            weatherData.hourly.snowfall[i],
            weatherData.hourly.visibility[i],
            weatherData.hourly.precipitation[i],
            weatherData.hourly.uvIndex[i]
        );
    }
    for (let i = 0; i < weatherData.daily.time.length; i++) {
        console.log(
            weatherData.daily.time[i].toISOString(),
            weatherData.daily.temperature2mMax[i],
            weatherData.daily.temperature2mMin[i],
            weatherData.daily.sunrise[i].toISOString(),
            weatherData.daily.sunset[i].toISOString(),
            weatherData.daily.uvIndexMax[i],
            weatherData.daily.rainSum[i],
            weatherData.daily.apparentTemperatureMax[i],
            weatherData.daily.apparentTemperatureMin[i],
            weatherData.daily.windSpeed10mMax[i]
        );
    }
    */
    return weatherData;
};

router.get('/current', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    params.latitude = Number(lat);
    params.longitude = Number(lon);

    try {
        const responses = await fetchWeatherApi(url, params);
        const weatherRawData = new WeatherForecast(decodeWeatherData(responses));
        res.json(weatherRawData.getCurrentWeather());
        params.latitude, params.longitude = null, null; 
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

router.get('/forecast/:city', async (req, res) => {
    try {
        const { latitude, longitude } = await cityToLatLong(req.params.city);

        params.latitude = latitude;
        params.longitude = longitude;

        const responses = await fetchWeatherApi(url, params);
        const weatherRawData = new WeatherForecast(decodeWeatherData(responses));
        res.json(weatherRawData.get16DayForecast());
        params.latitude, params.longitude = null, null; 
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

router.get('/trip-forecast/:city', async (req, res) => {
    const { latitude, longitude } = await cityToLatLong(req.params.city);

    params.latitude = latitude;
    params.longitude = longitude;

    const { tripStart, tripEnd } = req.query;
    if (!tripStart || !tripEnd) {
        return res.status(400).json({ error: 'Trip start and end dates are required' });
    }

    try {
        const responses = await fetchWeatherApi(url, params);
        const weatherRawData = new WeatherForecast(decodeWeatherData(responses));
        res.json(weatherRawData.getTripForecast(tripStart, tripEnd));
        params.latitude, params.longitude = null, null; 
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;