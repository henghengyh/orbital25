// For haohao's checking and implementation
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

import Navbar from '../../components/Navbar/navbar';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null)
    const [user, setUser] = useState(null); // State to store user information
    const navigate = useNavigate();

    const fetchWeather = async () => {
        try {
            const response = await axiosInstance.get(`/weather/${city}`);
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const getUserInfo = async () => {
        axiosInstance.get("/users/getUserInfo")
            .then((res) => {
                if (res.data && res.data.user) {
                    setUser(res.data.user); // Set user information from the response
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    console.error("Unauthorized access, redirecting to login.");
                }
                navigate("/");
            })
    }

    useEffect(() => {
        getUserInfo();
        return () => { }
    });

    return (
        <div className="start-div-block">
            <Navbar user={user} /> {/* Navbar component for navigation */}
            <div className='flex-1 p-8'>
                <h2>Weather Forecast</h2>
                <h1>Check the weather in your city</h1>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='border p-2 rounded-lg mb-4 w-64 h-5 flex'
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
        </div>
    );
};

export default Weather;