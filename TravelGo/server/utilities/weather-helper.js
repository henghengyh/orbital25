//For weather class

const MathHelper = require('./math-helper.js');

/** WMO Code Description Obtained from open-meteo API */
const wmoCodeToDescription = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};
class WeatherForecast {

    #apiDataCurrent;
    #apiDataDaily;

    /** WeatherForecast class constructor
     * @param {Object} apiData 
     * @property {Object} apiDataCurrent - Current weather data
     * @property {Object} apiDataHourly - Hourly weather data
     * @property {Object} apiDataDaily - Daily weather data
     */
    constructor(api) {
        this.#apiDataCurrent = WeatherForecast.#decodeCurrentWeather(api.current);
        this.#apiDataDaily = WeatherForecast.#decode16DayForecast(api.daily);
    }

    static #decodeCurrentWeather(currentData) {
        const {
            time,
            weatherCode,
            temperature2m,
            relativeHumidity2m,
            apparentTemperature,
            rain,
            cloudCover,
            snowfall
        } = currentData;
        return {
            time: time,
            weatherCode: wmoCodeToDescription[weatherCode] || "Unknown weather code",
            temperature2m: MathHelper.toTwodp(temperature2m),
            relativeHumidity2m: MathHelper.toTwodp(relativeHumidity2m),
            apparentTemperature: MathHelper.toTwodp(apparentTemperature),
            rain: MathHelper.toTwodp(rain),
            cloudCover: MathHelper.toTwodp(cloudCover),
            snowfall: MathHelper.toTwodp(snowfall)
        };
    }

    static #decode16DayForecast(dailyData) {
        const {
            time,
            temperature2mMax,
            temperature2mMin,
            sunrise,
            sunset,
            uvIndexMax,
            rainSum,
            apparentTemperatureMax,
            apparentTemperatureMin,
            windSpeed10mMax
        } = dailyData;

        const res = {};
        for (let i = 0; i < time.length; i++) {
            res[i] = {
                time: (new Date(time[i]).toString().slice(0, 15)),
                temperature2mMax: MathHelper.toTwodp(temperature2mMax[i]),
                temperature2mMin: MathHelper.toTwodp(temperature2mMin[i]),
                sunrise: sunrise[i],
                sunset: sunset[i],
                uvIndexMax: MathHelper.toTwodp(uvIndexMax[i]),
                rainSum: MathHelper.toTwodp(rainSum[i]),
                apparentTemperatureMax: MathHelper.toTwodp(apparentTemperatureMax[i]),
                apparentTemperatureMin: MathHelper.toTwodp(apparentTemperatureMin[i]),
                windSpeed10mMax: MathHelper.toTwodp(windSpeed10mMax[i])
            };
        }
        return res;
    }

    getCurrentWeather() {
        return this.#apiDataCurrent;
    }

    // This function returns a 16-day weather forecast including TODAY, which is the dat
    // of API call, not the date of the first day of trip
    // So is next 15 days of forecast
    get16DayForecast() {
        return this.#apiDataDaily;
    }

    getTripForecast(tripStart, tripEnd) {
        const tripForecast = {};
        const startDate = new Date(tripStart);
        const endDate = new Date(tripEnd);
        const processedAPIData = {};

        for (const key in this.#apiDataDaily) {
            const day = this.#apiDataDaily[key];
            const dateKey = new Date(day.time).toISOString().slice(0, 10);
            processedAPIData[dateKey] = day;
        }

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            tripForecast[d] = "Weather data not available";
            for (let d2 in processedAPIData) {
                if (d.toISOString().slice(0, 10) == d2) {
                    tripForecast[d] = processedAPIData[d.toISOString().slice(0, 10)];
                    break;
                }
            }
        }
        return tripForecast;
    }
}

class WeatherHistory {

    #summary;

    constructor(api) {
        const apiData = api.daily;
        this.time = apiData.time;
        this.temperature2mMax = apiData.temperature2mMax;
        this.temperature2mMin = apiData.temperature2mMin;
        this.sunrise = apiData.sunrise;
        this.sunset = apiData.sunset;
        this.rainSum = apiData.rainSum;
        this.snowfallSum = apiData.snowfallSum;
        this.temperature2mMean = apiData.temperature2mMean;
        this.summary = this.getSummary();
    }

    static #averageTemperature(parameter) {
        return parameter.reduce((a, b) => a + b, 0) / parameter.length;
    }

    #averageRainfall() {
        return this.rainSum.reduce((a, b) => a + b, 0) / this.rainSum.length;
    }

    #averageSnowfall() {
        return this.snowfallSum.reduce((a, b) => a + b, 0) / this.snowfallSum.length;
    }

    static #averageSunMovement(sunData) {
        const total = sunData
            .map(time => new Date(time).getTime())
            .reduce((acc, t) => acc + t, 0);
        const avgDate = new Date(total / sunData.length)
        return avgDate.toISOString().substring(11, 16);
    }

    #period() {
        const listOfDates = this.time.map(time => new Date(time)).map(date => date.toISOString().substring(0, 10));
        return listOfDates[0] + ' to ' + listOfDates[listOfDates.length - 1];
    }

    /** Summary Dictionary
     * @function
     * @returns {Object} - Summary of the weather history over the period
     * @property {string} period - Date period (YYYY-MM-DD to YYYY-MM-DD)
     * @property {number} averageTemperature - Average temperature (degC)
     * @property {number} averageTemperatureMax - Average maximum temperature (degC)
     * @property {number} averageTemperatureMin - Average minimum temperature (degC)
     * @property {number} averageRainfall - Average rainfall (mm)
     * @property {number} averageSnowfall - Average snowfall (mm)
     * @property {string} averageSunrise - Average sunrise time (HH:MM)
     * @property {string} averageSunset - Average sunset time (HH:MM)
     * @property {Object} alerts - Weather alerts
     * @subproperty {Object} alerts.rainfall - Rainfall alert ({alert: boolean, msg: string})
     * @subproperty {Object} alerts.snowfall - Snowfall alert ({alert: boolean, msg: string})
     * @subproperty {Object} alerts.drasticTemperatureChange - Drastic temperature change alert ({alert: boolean, msg: string})
     */
    getSummary() {
        return {
            period: this.#period(),
            averageTemperature: MathHelper.toTwodp(WeatherHistory.#averageTemperature(this.temperature2mMean)),
            averageTemperatureMax: MathHelper.toTwodp(WeatherHistory.#averageTemperature(this.temperature2mMax)),
            averageTemperatureMin: MathHelper.toTwodp(WeatherHistory.#averageTemperature(this.temperature2mMin)),
            averageRainfall: MathHelper.toTwodp(this.#averageRainfall()),
            averageSnowfall: MathHelper.toTwodp(this.#averageSnowfall()),
            averageSunrise: WeatherHistory.#averageSunMovement(this.sunrise),
            averageSunset: WeatherHistory.#averageSunMovement(this.sunset),
            alerts: {
                rainfall: this.rainfallAlert(),
                snowfall: this.snowfallAlert(),
                drasticTemperatureChange: this.drasticDailyTemperatureChangeAlert()
            }
        }
    }

    rainfallAlert() {
        const heavyRain = this.rainSum.some(val => val > 10);
        const validRainSum = this.rainSum.filter(val => typeof val === 'number' && !isNaN(val));
        const maxRainfall = MathHelper.toTwodp(Math.max(...validRainSum));
        let alert, msg;
        if (heavyRain) {
            alert = true;
            msg = `Alert: High rainfall of ${maxRainfall} mm present last year.`;
        } else {
            alert = false;
            msg = `Rainfall is within normal range, maximum recorded is ${maxRainfall} mm.`;
        }
        return { alert, msg };
    }

    snowfallAlert() {
        const heavySnow = this.snowfallSum.some(val => val > 10);
        const validSnowSum = this.snowfallSum.filter(val => typeof val === 'number' && !isNaN(val));
        const maxSnowfall = MathHelper.toTwodp(Math.max(...validSnowSum))
        let alert, msg;
        if (heavySnow) {
            alert = true;
            msg = `Alert: High snowfall of ${maxSnowfall} mm present last year.`;
        } else {
            alert = false;
            msg = `Snowfall is within normal range, maximum recorded is ${maxSnowfall} mm.`;
        }
        return { alert, msg };
    }

    drasticDailyTemperatureChangeAlert() {
        for (let i = 1; i < this.temperature2mMax.length; i++) {
            const tempChange = Math.abs(this.temperature2mMax[i] - this.temperature2mMax[i - 1]);
            if (tempChange > 10) {
                return {
                    alert: true,
                    msg: `Alert: Drastic daily temperature change of ${MathHelper.toTwodp(tempChange)}°C detected on ${new Date(this.time[i])}.`
                };
            }
        }
        return {
            alert: false,
            msg: 'No drastic daily temperature changes (+/- 10°C) detected.'
        };
    }

    getAlerts() {
        return {
            rainfall: this.rainfallAlert(),
            snowfall: this.snowfallAlert(),
            drasticTemperatureChange: this.drasticDailyTemperatureChangeAlert()
        };
    }
}

module.exports = { WeatherForecast, WeatherHistory };