// For haohao's checking and implementation
import React, { useState } from 'react';

import axiosInstance from '../../utils/axiosInstance';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null)

    const fetchWeather = async () => {
        try {
            const response = await axiosInstance.get(`/weather-forecast/forecast/${city}`);
            setWeather(response.data);
        } catch (error) {
            setWeather(null);
            console.log('Error fetching weather data:', error);
        }
    };

    const show = (weather, city) => {
        if (!weather) return <p>Key in a valid city above.</p>;
        const days = Object.values(weather);
        const keyStyle = "font-medium text-gray-600";
        const valStyle = "text-gray-800";
        return (
            <div>
                <div className="mb-4 text-gray-700 text-base">
                    Displaying search results for:&nbsp;
                    <span className="font-bold text-blue-700">{city.toString()}</span>
                </div>
                <div style={{ height: '5px' }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {days.map((day, i) => (
                        <div 
                            key={i} 
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 mb-6 mx-auto max-w w-full" 
                        >
                            <h4 className="text-lg font-semibold text-blue-700 mb-2">{day.time}</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className={keyStyle}>Max Temp:</span> 
                                <span className={valStyle}>{day.temperature2mMax}°C</span>

                                <span className={keyStyle}>Min Temp:</span> 
                                <span className={valStyle}>{day.temperature2mMin}°C</span>

                                <span className={keyStyle}>Rain:</span> 
                                <span className={valStyle}>{day.rainSum}mm</span>

                                <span className={keyStyle}>Max UV Index:</span> 
                                <span className={valStyle}>{day.uvIndexMax}</span>

                                <span className={keyStyle}>Max Wind Speed:</span> 
                                <span className={valStyle}>{day.windSpeed10mMax}m/s</span>

                                <span className={keyStyle}>Sunrise:</span> 
                                <span className={valStyle}>{new Date(day.sunrise).toLocaleTimeString()}</span>

                                <span className={keyStyle}>Sunset:</span> 
                                <span className={valStyle}>{new Date(day.sunset).toLocaleTimeString()}</span>

                            </div>
                        </div>
                    ))}
                </div>
            </div>);
    };

    return (
        <div className="start-block">
            <div className='flex-1 p-8'>
                <h2 className="font-bold">Current Weather</h2>
                <div style={{ height: '1px' }} />
                <h1>Function will be linked soon :D</h1>
            </div>
            {/** Insert code to detect own location and display current weather here */}

            <div className='flex-1 p-8'>
                <h2 className="font-bold">Weather Forecast</h2>
                <div style={{ height: '1px' }} />
                <h1>Check the weather in your city</h1>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        if (e.target.value === "") setWeather(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") fetchWeather();
                    }}
                    className='border p-2 rounded-lg mb-4 w-64 h-5 flex'
                />
                <button 
                    onClick={fetchWeather}
                    className="bg-blue-600 
                        hover:bg-blue-700 
                        text-white 
                        font-bold 
                        py-2 px-6 
                        rounded-lg 
                        shadow-md 
                        transition duration-200 ease-in-out 
                        transform hover:scale-105 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-blue-400"
                >
                    Get Weather
                </button>
                <div style={{ height: '1em' }} />
                    {show(weather, city)}
            </div>
        </div>
    );
};

export default Weather;