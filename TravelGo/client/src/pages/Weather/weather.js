// For haohao's checking and implementation
import { useState, useEffect } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import axiosInstance from '../../utils/axiosInstance';

const Weather = () => {
    // Itinerary Weather
    const [itineraryWeather, setItineraryWeather] = useState(null);
    let destination;

    // General Weather
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [loadingCurrent, setLoadingCurrent] = useState(false);
    const [cityName, setCityName] = useState('');

    function localTimeDisplay(timeInfo) {
        const hr24String = new Date(timeInfo).toUTCString().slice(17,22);
        const hour = Number(hr24String.slice(0,2));
        let behind = "";
        if (hour < 12) {
            behind = "AM";
            return hour.toString() + hr24String.slice(2,) + " " + behind;
        } else {
            behind = "PM";
            return (hour - 12).toString() + hr24String.slice(2,) + " " + behind;
        }
        // Note that the raw data given is alr in local time, doing toLocaleTimeString() will apply double conversion!
    }


    useEffect(() => {
        fetchTripWeather();
        fetchCurrentWeather();
    }, []);

    //A1. Fetch first upcoming itinerary weather based on trip
    const fetchTripWeather = async () => {
        try {
            const response_itinerary = await axiosInstance.get(`/itineraries/get-all-itineraries`);
            const upcomingTrips = getUpcomingTrips(response_itinerary.data.itineraries); 
            if (upcomingTrips.length === 0) {
                console.log('No upcoming trips found.');
                setItineraryWeather([]);
            } else {
                const firstTrip = upcomingTrips[0];
                destination = firstTrip.destination;
                const tripStart = firstTrip.startDate.slice(0, 10);
                const tripEnd = firstTrip.endDate.slice(0,10);
                const response_weather = await axiosInstance.get(`/weather-forecast/trip-forecast/${destination}?tripStart=${tripStart}&tripEnd=${tripEnd}`);
                setItineraryWeather(response_weather.data);
                console.log(response_weather.data);
            }            
        } catch (error) {
            console.log('Error fetching trip\'s weather data:', error);
        }
    }

    // ISSUE: To compare today's dates in the destination's local time zone, for each itinerary.
    //A1a. Helper function to identify next upcoming trip
    const getUpcomingTrips = function(itineraries) {
        const today = new Date();
        return itineraries.filter(itinerary => {
            const startDate = new Date(itinerary.startDate);
            return startDate >= today;
        });
    };

    //A2. Display itinerary weather forecast
    const showTripForecast = () => {
        if (!itineraryWeather) return <div className="flex text-gray-500 justify-center items-center">Loading...</div>;
        if (itineraryWeather.length === 0) return <div className="flex text-gray-500 justify-center items-center">No future itinerary detected! Go and start your travelling journey now!</div>;
        const days = Object.entries(itineraryWeather);
        console.log(itineraryWeather);
        const keyStyle = "font-medium text-gray-600";
        const valStyle = "text-gray-800";
        return (
            <div>
                <div className="mb-4 text-gray-700 text-base">
                    Displaying weather forecast results for:&nbsp;
                    <span className="font-bold text-blue-700">{destination}</span>
                </div>
                <div style={{ height: '5px' }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {days.map(([key, day], i) => 
                        itineraryWeather[day] === "Weather data not available" ? (
                            <div 
                                key={i} 
                                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 mb-6 mx-auto max-w w-full" 
                            >
                                <h4 className="text-lg font-semibold text-blue-700 mb-2">{key.slice(0, 15)}</h4>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-1">
                                    <span className={valStyle}>Weather data not available</span>
                                </div>
                            </div>
                        ) : (
                            <div 
                                key={i} 
                                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 mb-6 mx-auto max-w w-full" 
                            >
                                <h4 className="text-lg font-semibold text-blue-700 mb-2">{key.slice(0, 15)}</h4>
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
                                    <span className={valStyle}>{localTimeDisplay(day.sunrise)}</span>

                                    <span className={keyStyle}>Sunset:</span> 
                                    <span className={valStyle}>{localTimeDisplay(day.sunset)}</span>

                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    };

    //B1. Fetch current weather based on geolocation
    const fetchCurrentWeather = async () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                const response = await axiosInstance.get(`/weather-forecast/current?lat=${latitude}&lon=${longitude}`);
                setCurrentWeather(response.data);

                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const geoData = await geoRes.json();
                const name = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || '';
                setCityName(name);
            } catch (error) {
                console.error('Error setting current weather:', error);
                setCurrentWeather(null);
            }
            setLoadingCurrent(false);
        }, () => setLoadingCurrent(false));
    };

    //B2. Current weather display lambda
    const showCurrentWeather = () => {
        if (loadingCurrent) return <div className="text-blue-600 font-semibold">Detecting location...</div>;
        if (!currentWeather) return <div className="text-gray-500">Loading...</div>;
        return (
            <div className="flex-none">
                <h2 className="font-bold mb-2">Current Weather</h2>
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 max-w-xs w-full">
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Your Location</h4>
                    <div className="mb-2 text-gray-600">{ () => cityName }</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <span className="font-medium text-gray-600">Temp:</span>
                        <span className="text-gray-800">{currentWeather.temperature2m}°C</span>
                        <span className="font-medium text-gray-600">Weather:</span>
                        <span className="text-gray-800">{currentWeather.weatherCode}</span>
                        <span className="font-medium text-gray-600">Humidity:</span>
                        <span className="text-gray-800">{currentWeather.relativeHumidity2m}%</span>
                        <span className="font-medium text-gray-600">Feels like:</span>
                        <span className="text-gray-800">{currentWeather.apparentTemperature} °C</span>
                        <span className="font-medium text-gray-600">At time:</span>
                        <span className="text-gray-800">{localTimeDisplay(currentWeather.time)}</span>
                    </div>
                </div>
            </div>
        );
    };

    //C1. City input display lambda
    const showCityInput = () => {
        return (
            <div className='flex-col w-80'>
                <h2 className="font-bold mb-2 w-80">Weather Forecast</h2>
                <h1 className='w-80'>Check the weather in your city</h1>
                <div className="flex flex-col gap-2 pt-1 w-80">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            if (e.target.value === "") setWeather(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") fetchSearchWeather();
                        }}
                        className='border p-2 py-4 rounded-lg w-64 h-7 flex'
                    />
                    <div style={{ height: '1pt' }} />
                    <button 
                        onClick={fetchSearchWeather}
                        className="bg-blue-600 
                            hover:bg-blue-700 
                            text-white 
                            font-bold 
                            py-2 px-6
                            
                            w-40
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
                    <div className="text-sm italic py-2 w-60">  
                        Open-Meteo API is used to fetch the weather data. Only the first 16 days of forecast is available, including today.
                    </div>
                </div>
            </div>
        );
    };

    //C2. Fetch weather forecast based on city input
    const fetchSearchWeather = async () => {
        try {
            if (!city) {
                setWeather(null);
            } else {
                const response = await axiosInstance.get(`/weather-forecast/forecast/${city}`);
                setWeather(response.data);
            }
        } catch (error) {
            setWeather(null);
            console.log('Error fetching weather data:', error);
        }
    };

    //C3. Forecast weather display lambda 
    const showSearchForecast = (weather, city) => {
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
                                <span className={valStyle}>{localTimeDisplay(day.sunrise)}</span>

                                <span className={keyStyle}>Sunset:</span> 
                                <span className={valStyle}>{localTimeDisplay(day.sunset)}</span>

                            </div>
                        </div>
                    ))}
                </div>
            </div>);
    };

    return (
        <div className="flex flex-col gap-8 p-8">
            <TabGroup>
                <TabList className="flex justify-center gap-4 mb-6">
                    <Tab
                    className={({ selected }) =>
                            `px-6 py-2 rounded-full font-semibold transition focus:outline-none
                            ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-700 hover:bg-blue-300 transform hover:scale-105'}`
                    }
                    
                    >
                        Itinerary Weather
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            `px-6 py-2 rounded-full font-semibold transition focus:outline-none
                            ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-700 hover:bg-blue-300 transform hover:scale-105'}`
                        }   
                    >
                        General Weather
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {/* Itinerary Weather Content */}
                        {showTripForecast()}
                    </TabPanel>
                    <TabPanel>
                        {/* General Weather Content */}
                        <div className="flex flex-row justify-center items-center w-full gap-40">
                            {showCurrentWeather()}
                            {showCityInput()}
                        </div>
                        <div style={{ height: '30pt' }} />
                        <div style={{ height: '1em' }}>
                            {showSearchForecast(weather, city)}
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default Weather;