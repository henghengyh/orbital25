import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance'; 
import TransportRow from './Transport/TransportRow';

export default function TransportModal({ 
    modeOfTransport, 
    setModeOfTransport,
    startLocation,
    setStartLocation,
    endLocation,
    setEndLocation 
}) {
    const [startSearchQuery, setStartSearchQuery] = useState('');
    const [endSearchQuery, setEndSearchQuery] = useState('');
    const [startSearchResults, setStartSearchResults] = useState([]);
    const [endSearchResults, setEndSearchResults] = useState([]);
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [showEndDropdown, setShowEndDropdown] = useState(false);

    const transportModes = ["Walk", "Car", "Public Transport"];

    const searchLocations = async function (query, setResults, setShowDropdown, name) {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/maps/search-locations?query=${query}`);
            const resultsList = response.data.places || [];
            setResults(resultsList);
            setShowDropdown(true);
        } catch (error) {
            console.error(`Error searching ${name}:`, error);
            setResults([]);
        }
    };

    const handleStartLocationSelect = (location) => {
        setStartLocation(location);
        setStartSearchQuery(location.description);
        setShowStartDropdown(false);
        setStartSearchResults([]);
    };

    const handleEndLocationSelect = (location) => {
        setEndLocation(location);
        setEndSearchQuery(location.description);
        setShowEndDropdown(false);
        setEndSearchResults([]);
    };

    useEffect(() => {
        if (startLocation) {
            setStartSearchQuery(startLocation.description || '');
        }
    }, [startLocation]);

    useEffect(() => {
        if (endLocation) {
            setEndSearchQuery(endLocation.description || '');
        }
    }, [endLocation]);

    return (
        <div className="space-y-4 pt-4">
            <div className="flex gap-5 items-center">
                <div className="min-w-fit">
                    <h6 className="text-label">Mode of Transport:</h6>
                </div>
                <div className="flex-1">
                    <select
                        value={modeOfTransport || ''}
                        onChange={(e) => setModeOfTransport(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select mode of transport</option>
                        {transportModes.map((mode) => (
                            <option key={mode} value={mode.toLowerCase()}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <TransportRow
                label="Start Location"
                searchQuery={startSearchQuery}
                setSearchQuery={setStartSearchQuery}
                searchResults={startSearchResults}
                showDropdown={showStartDropdown}
                setShowDropdown={setShowStartDropdown}
                onLocationSelect={handleStartLocationSelect}
                searchLocations={(query) => searchLocations(query, setStartSearchResults, setShowStartDropdown, "start location")}
                placeholder="Search for start location..."
            />

            {/* End Location Row */}
            <TransportRow
                label="End Location"
                searchQuery={endSearchQuery}
                setSearchQuery={setEndSearchQuery}
                searchResults={endSearchResults}
                showDropdown={showEndDropdown}
                setShowDropdown={setShowEndDropdown}
                onLocationSelect={handleEndLocationSelect}
                searchLocations={(query) => searchLocations(query, setEndSearchResults, setShowEndDropdown, "end location")}
                placeholder="Search for end location..."
            />
        </div>
    );
}