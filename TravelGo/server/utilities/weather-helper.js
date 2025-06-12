//For weather class

const MathHelper = require('./math-helper.js');

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
        this.#apiDataCurrent = api.current;
        this.#apiDataDaily = WeatherForecast.#decode16DayForecast(api.daily);
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
            res["day " + (i + 1).toString()] = {
                time: time[i],
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

    // This function returns a 16-day weather forecast from TODAY, which is the dat
    // of API call, not the date of the first day of trip
    get16DayForecast() {
        return this.#apiDataDaily;
    }

    getTripForecast(tripStart, tripEnd) {
        const tripForecast = {};
        const startDate = new Date(tripStart);
        const endDate = new Date(tripEnd);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            tripForecast[d] = "Weather data not available";   
        }  

        for (const day in this.#apiDataDaily) {
            const dayDate = new Date(this.#apiDataDaily[day].time);
            if (dayDate >= startDate && dayDate <= endDate) {
                tripForecast[dayDate] = this.#apiDataDaily[day];
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
        const maxRainfall = MathHelper.toTwodp(Math.max(...this.rainSum));
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
        const maxSnowfall = MathHelper.toTwodp(Math.max(...this.snowfallSum))
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
            msg: 'No drastic daily temperature changes detected.'
        };
    }
}

module.exports = { WeatherForecast, WeatherHistory };