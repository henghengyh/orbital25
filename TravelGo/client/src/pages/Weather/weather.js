import { useState, useEffect, useCallback, useRef } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import axiosInstance from '../../utils/axiosInstance';

const Weather = () => {
    // Itinerary Weather
    const [allItineraries, setAllItineraries] = useState([]);
    const [itineraryWeather, setItineraryWeather] = useState(null);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [selectedItineraryId, setSelectedItineraryId] = useState('');
    const [weatherWarnings, setWeatherWarnings] = useState(null);
    const destination = useRef();

    // General Weather
    const [city, setCity] = useState('');
    const [cityName] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingCurrent, setLoadingCurrent] = useState(false);
    const [weather, setWeather] = useState(null);

    function localTimeDisplay(timeInfo) {
        const hr24String = new Date(timeInfo).toUTCString().slice(17, 22);
        const hour = Number(hr24String.slice(0, 2));
        let behind = "";
        if (hour < 12) {
            behind = "AM";
            return hour.toString() + hr24String.slice(2,) + " " + behind;
        } else {
            behind = "PM";
            if (hour === 12) return hr24String + " " + behind;
            return (hour - 12).toString() + hr24String.slice(2,) + " " + behind;
        }
        // Note that the raw data given is alr in local time, doing toLocaleTimeString() will apply double conversion!
    }

    async function getWithRetry(url, options, retries = 10) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axiosInstance.get(url, options);
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}

    //A1. Fetch all itineraries
    const fetchAllItineraries = async () => {
        try {
            const response_itinerary = await axiosInstance.get(`/itineraries/get-all-itineraries`);
            setAllItineraries(response_itinerary.data.itineraries);
            console.log('All itineraries fetched:', response_itinerary.data.itineraries);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    }

    //A2. Fetch weather based on selected itinerary
    const fetchTripWeather = useCallback(async (selectedItinerary) => {
        try {
            if (!selectedItinerary) {
                setItineraryWeather(null);
            } else {
                setLoading(true);
                destination.current = selectedItinerary.destination;
                const tripStart = selectedItinerary.startDate.slice(0, 10);
                const tripEnd = selectedItinerary.endDate.slice(0, 10);
                const response_weather = await getWithRetry(`/weather-forecast/trip-forecast/${destination.current}?tripStart=${tripStart}&tripEnd=${tripEnd}`, { timeout: 7000 });
                setItineraryWeather(response_weather.data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching trip\'s weather data:', error);
        }
    }, []);

    //A3. Dropdown to select itinerary
    const dropdownItinerary = () => {
        return (
            <div className="mb-2">
                <label htmlFor="itinerary-select" className="mr-2 font-medium text-gray-700">
                    Select Itinerary:
                </label>
                <select
                    id="itinerary-select"
                    className="w-64 border rounded px-2 py-1"
                    value={selectedItineraryId}
                    onChange={e => {
                        setSelectedItinerary(e.target.value);
                        const selected = allItineraries.find(it => it._id === e.target.value);
                        try {
                            setSelectedItinerary(selected);
                        } catch (error) {
                            setSelectedItinerary(null);
                            setItineraryWeather(null);
                        }
                        setSelectedItineraryId(e.target.value);
                        if (selected) { fetchTripWeather(selected); fetchWeatherWarnings(selected); }
                    }}
                >
                    <option value="">-- Choose --</option>
                    {allItineraries.map(itinerary => (
                        <option key={itinerary._id} value={itinerary._id}>
                            {itinerary.destination} ({itinerary.startDate.slice(0, 10)} to {itinerary.endDate.slice(0, 10)})
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    //A4. Display itinerary weather forecast
    const showTripForecast = () => {
        if (!selectedItinerary) return <div className="flex text-gray-500 justify-center items-center">Select an Itinerary!</div>;
        if (weatherWarnings && loading) return (
            <div className='flex flex-col justify-center items-center mt-4'>
                <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin"></div>
                <p className="mt-2 ml-2">Loading...</p>
            </div>);
        if (!itineraryWeather) return;
        const pairs = Object.entries(itineraryWeather);

        const keyStyle = "font-medium text-gray-600";
        const valStyle = "text-gray-800";
        console.log('Itinerary Weather Data:', itineraryWeather);

        return (
            <div>
                <div style={{ height: '10pt' }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pairs.map(([key, day], i) =>
                        day === "Weather data not available" ? (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 mx-auto mb-6 max-w w-full"
                            >
                                <h4 className="text-lg font-semibold text-blue-700 mb-2">{key.slice(0, 15)}</h4>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-1">
                                    <span className={valStyle}>Weather data not available</span>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 mx-auto mb-6 max-w w-full"
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

    // A5. Fetch weather warnings for the selected itinerary
    const fetchWeatherWarnings = useCallback(async (itinerary) => {
        if (!itinerary) return;

        function minusOneYear(date) {
            const year = Number(date.slice(0, 4)) - 1;
            return year.toString() + date.slice(4, 10);
        }
        const tripStart = itinerary.startDate.slice(0, 10);
        const tripEnd = itinerary.endDate.slice(0, 10);
        const historyStart = minusOneYear(tripStart);
        const historyEnd = minusOneYear(tripEnd);
        const city = itinerary.destination;
        const response = await getWithRetry(`weather-history/${city}/${historyStart}_${historyEnd}`, { timeout: 7000 }); //INTRODUCED TIMEOUT HERE
        setWeatherWarnings(response.data);
    },[]);

    //A6. Display itinerary weather warnings
    const showWeatherWarnings = () => {
        if (allItineraries.length === 0) return;
        if (!selectedItinerary) return;

        const tripStart = selectedItinerary.startDate.slice(0, 10);
        const tripEnd = selectedItinerary.endDate.slice(0, 10);

        if (!weatherWarnings) return (
            <div className='flex flex-col justify-center items-center mt-2'>
                <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin"></div>
                <p className="mt-2 ml-2">Loading...</p>
            </div>);

        function numberOfWarnings() {
            let count = 0;
            if (weatherWarnings.rainfall.alert) count++;
            if (weatherWarnings.snowfall.alert) count++;
            if (weatherWarnings.drasticTemperatureChange.alert) count++;
            return count;
        }

        const bannerColour = numberOfWarnings() >= 1 ? "yellow" : "green";
        const bannerBgClass = bannerColour === "yellow" ? "bg-yellow-100 border-yellow-500 text-yellow-800" : "bg-green-100 border-green-500 text-green-800";
        const bannerTextClass = bannerColour === "yellow" ? "text-yellow-700" : "text-green-700";

        return (
            <>
                <div className={`border-l-4 p-4 ${bannerBgClass}`}>
                    <h2 className={`font-bold mb-2 ${bannerBgClass.split(' ')[2]}`}>Weather Warnings (Based on past 1 year data)</h2>
                    <div>
                        <span className="font-semibold">Destination:</span> {selectedItinerary.destination} &nbsp;|&nbsp;
                        <span className="font-semibold">Trip Period:</span> {tripStart} to {tripEnd}
                    </div>
                    <div className={`mt-2 ${bannerTextClass}`}>
                        <p>{weatherWarnings.rainfall.msg}</p>
                        <p>{weatherWarnings.snowfall.msg}</p>
                        <p>{weatherWarnings.drasticTemperatureChange.msg}</p>
                    </div>
                </div>
            </>
        );
    }

    //B1. Fetch current weather based on geolocation
    const fetchCurrentWeather = useCallback(async () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                const response = await getWithRetry(`/weather-forecast/current?lat=${latitude}&lon=${longitude}`, { timeout: 7000 });
                setCurrentWeather(response.data);
                //Some errors with API responses
                //const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`); 
                //const geoData = await geoRes.json();
                //const name = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || '';
                //setCityName(name);
            } catch (error) {
                console.error('Error setting current weather:', error);
                setCurrentWeather(null);
            }
            setLoadingCurrent(false);
        }, () => setLoadingCurrent(false));
    }, []);

    useEffect(() => {
        fetchAllItineraries();
        fetchTripWeather(null);
        fetchWeatherWarnings(null);
        fetchCurrentWeather();
    }, [fetchTripWeather, fetchWeatherWarnings, fetchCurrentWeather]);

    //B2. Current weather display lambda
    const showCurrentWeather = () => {
        if (loadingCurrent) return <div className="text-blue-600 font-semibold">Detecting location...</div>;
        if (!currentWeather) return <div className="text-gray-500">Loading...</div>;
        return (
            <div className="flex-none">
                <h2 className="font-bold mb-2">Current Weather</h2>
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 max-w-xs w-full">
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Your Location</h4>
                    <div className="mb-2 text-gray-600">{() => cityName}</div>
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
                setLoading(true);
                const response = await getWithRetry(`/weather-forecast/forecast/${city}`, { timeout: 7000 });
                setWeather(response.data);
            }
        } catch (error) {
            setWeather(null);
            console.log('Error fetching weather data:', error);
        } finally {
            setLoading(false);
        }
    };

    //C3. Forecast weather display lambda 
    const showSearchForecast = (weather, city) => {
        if (loading) return (
            <div className='flex flex-col justify-center items-center'>
                <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin"></div>
                <p className="mt-2 ml-2">Loading...</p>
            </div>);
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
        <div className="start-block flex flex-col gap-8 px-8">
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
                        {dropdownItinerary()}
                        {selectedItinerary && (
                            <div className="mb-2 text-gray-700 text-base">
                                Displaying weather forecast results for:&nbsp;
                                <span className="font-bold text-blue-700">{selectedItinerary.tripName}</span>
                            </div>
                        )}
                        {showWeatherWarnings()}
                        {showTripForecast()}
                    </TabPanel>
                    <TabPanel>
                        {/* General Weather Content */}
                        <div>
                            <div className="flex flex-row justify-center items-center w-full gap-40">
                                {showCurrentWeather()}
                                {showCityInput()}
                            </div>
                            <div style={{ height: '30pt' }} />
                            <div style={{ height: '1em' }}>
                                {showSearchForecast(weather, city)}
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default Weather;