// For haohao's checking and implementation
import React, { useState } from 'react';
import axios from 'axios';

import Navbar from '../../components/Navbar/navbar';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`/api/weather/${city}`);
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div>
            <Navbar /> {/* Navbar component for navigation */}
            <h2>Weather Forecast</h2>
            <h1>Check the weather in your city</h1>
            <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={fetchWeather}>Get Weather</button>
            {weather && (
                <div>
                    <h3>{weather.name}</h3>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
};

export default Weather;