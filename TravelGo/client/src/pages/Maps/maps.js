import { useCallback, useEffect, useRef, useState } from "react";

import { loadGoogleMaps } from '../../utils/googleMapsLoader';
import { getGradientByActivityType, searchPlaces, displayItineraryOnMap } from './MapHelpers';
import axiosInstance from '../../utils/axiosInstance';
import MapContainer from "../../components/Modals/Maps/MapContainer";
import MapInstructions from './MapInstructions';
import MapLegend from "../../components/Modals/Maps/MapLegend";
import MapsOverlaysSearchBar from "../../components/Modals/Maps/MapsOverlaysSearchBar";

export default function Maps() {
    const mapRef = useRef(null);
    const [allItineraries, setAllItineraries] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);

    const [customPopup, setCustomPopup] = useState(null);
    const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
    const [itineraryOverlay, setItineraryOverlay] = useState(null);
    const [polylines, setPolylines] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedItineraryId, setSelectedItineraryId] = useState('');

    /**
     * There are 3 main functions to populate/ clean the map:
     * 1. addMarker: Adds a marker to the map at a specified location.
     * 2. clearItineraryOverlay: Clears all markers and polylines related to the itinerary overlay.
     * 3. loadItineraryOverlay: Loads an itinerary overlay from the server and displays it on the map.
     * 
     * Over here, we define a marker as a point on the map represented by a pin or icon. 
     */

    const addMarker = useCallback((location, mapInstance) => {
        const marker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            title: "Custom Location"
        });

        setMarkers(prev => [...prev, marker]);
    }, []);

    const clearItineraryOverlay = () => {
        markers.forEach(marker => {
            if (marker.getTitle() !== "Your Location") {
                marker.setMap(null);
            }
        });
        polylines.forEach(polyline => {
            polyline.setMap(null);
        });
        setMarkers([]);
        setPolylines([]);
    };

    const loadItineraryOverlay = async (itineraryId, date = null) => {
        if (!itineraryId) return;

        try {
            setIsLoadingOverlay(true);
            const params = date ? { date } : {};
            const response = await axiosInstance.get(`/maps/itinerary-overlay/${itineraryId}`, { params });
            setItineraryOverlay(response.data);
            handleDisplayItinerary(response.data);
        } catch (error) {
            console.error('Error loading itinerary overlay:', error);
            alert('Failed to load itinerary overlay');
        } finally {
            setIsLoadingOverlay(false);
        }
    };

    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .custom-marker-label {
                background-color: #ff4444 !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                width: 24px !important;
                height: 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin-left: 20px !important;
                margin-top: -10px !important;
            }
        `;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    useEffect(() => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

        loadGoogleMaps(apiKey)
            .then(() => setIsLoaded(true))
            .catch(error => console.error('Error loading Google Maps:', error));
    }, []);

    const fetchAllItineraries = async () => {
        try {
            const response_itinerary = await axiosInstance.get(`/itineraries/get-all-itineraries`);
            setAllItineraries(response_itinerary.data.itineraries);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    }

    useEffect(() => {
        fetchAllItineraries();
    }, []);

    const dropdownItinerary = () => {
        return (
            <div className="mb-2">
                <label htmlFor="itinerary-select" className="block mb-2 pl-2 font-medium text-gray-700">
                    Select Itinerary:
                </label>
                <select
                    id="itinerary-select"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedItineraryId}
                    onChange={e => {
                        const selected = allItineraries.find(it => it._id === e.target.value);
                        setSelectedItinerary(selected || null);
                        setSelectedItineraryId(e.target.value);
                    }}
                >
                    <option value="">-- Choose an Itinerary --</option>
                    {allItineraries.map(itinerary => (
                        <option key={itinerary._id} value={itinerary._id}>
                            {itinerary.destination.replace(/\b\w/g, c => c.toUpperCase())} ({itinerary.startDate.slice(0, 10)} to {itinerary.endDate.slice(0, 10)})
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    /** provide the map with initial settings (intiialistion) &. centralising it to the user's location
     * 
     * @param {Object} center - The center coordinates for the map
     * @param {number} center.lat - Latitude coordinate (e.g., 1.3521 for Singapore)
     * @param {number} center.lng - Longitude coordinate (e.g., 103.8198 for Singapore)
     */

    const initializeMap = useCallback((center) => {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: center,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "on" }]
                }
            ]
        });

        const userLocationMarker = new window.google.maps.Marker({
            position: center,
            map: mapInstance,
            title: "Your Location",
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(40, 40)
            }
        });

        mapInstance.addListener("click", (event) => {
            addMarker(event.latLng, mapInstance);
        });
        setMarkers([userLocationMarker]);
        setMap(mapInstance);
    }, [addMarker, setMarkers, setMap]);

    useEffect(() => {
        if (isLoaded && mapRef.current && !map) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userPos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        initializeMap(userPos);
                    },
                    () => {
                        const defaultPos = { lat: 1.3521, lng: 103.8198 };
                        initializeMap(defaultPos);
                    }
                );
            } else {
                const defaultPos = { lat: 1.3521, lng: 103.8198 };
                initializeMap(defaultPos);
            }
        }
    }, [isLoaded, map, initializeMap]);

    const handleDisplayItinerary = (itineraryData) => {
        displayItineraryOnMap(
            itineraryData,
            map,
            clearItineraryOverlay,
            showCustomPopup,
            setMarkers,
            setPolylines
        );
    };

    const showCustomPopup = (activity, position, sequenceNumber) => {
        const popup = { activity, position, sequenceNumber, visible: true };
        setCustomPopup(popup);
    };

    const hideCustomPopup = () => {
        setCustomPopup(null);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery || !searchQuery.trim()) return;

        try {
            await searchPlaces(searchQuery.trim(), map, markers, setMarkers);
        } catch (error) {
            alert('Search failed. Please try again.');
        }
    };

    const handleLoadItinerary = () => {
        if (selectedItineraryId) {
            loadItineraryOverlay(selectedItineraryId, selectedDate);
        }
    };

    const instructionsButton = () => {
        return (
            <button
                onClick={() => setShowInstructions(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instructions
            </button>
        );
    }

    return (
        <div className="start-block">
            <div className='flex-1 p-8 pt-0'>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome to Maps!</h1>
                        <p className="text-gray-600">Visualize your travel plans on an interactive map with activity markers, routes, and location search.</p>
                    </div>
                    {instructionsButton()}
                </div>

                {/* Itinerary Overlay Controls */}
                <div className="mb-4 p-4 px-6 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-semibold mb-2 text-blue-800 pl-2">Itinerary Overlay</h3>
                    <div className="flex flex-col gap-2 mb-2">
                        {dropdownItinerary()}
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional: Filter by date"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleLoadItinerary}
                            disabled={!selectedItineraryId || isLoadingOverlay}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                        >
                            {isLoadingOverlay ? 'Loading...' : 'Load Itinerary'}
                        </button>
                        <button
                            onClick={clearItineraryOverlay}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Clear Overlay
                        </button>
                    </div>
                    {itineraryOverlay && (
                        <div className="mt-2 text-sm text-blue-700">
                            <strong>Itinerary:</strong> {itineraryOverlay.itineraryName}
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Total Activities:</strong> {itineraryOverlay.stats.totalActivities}</li>
                                <li><strong>Activities with Locations:</strong> {itineraryOverlay.stats.activitiesWithLocation}</li>
                                {itineraryOverlay.stats.transportActivities > 0 && (
                                    <li><strong>Transport Activities:</strong> {itineraryOverlay.stats.transportActivities}</li>
                                )}
                            </ul>
                        </div>
                    )}
                    {selectedItinerary && !itineraryOverlay && (
                        <div className="mt-2 text-sm text-gray-600">
                            Selected: <strong>{selectedItinerary.destination}</strong> ({selectedItinerary.startDate.slice(0, 10)} to {selectedItinerary.endDate.slice(0, 10)})
                        </div>
                    )}
                </div>

                <MapsOverlaysSearchBar
                    handleSearch={handleSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    markers={markers}
                    setMarkers={setMarkers}
                />

                <MapContainer
                    isLoaded={isLoaded}
                    mapRef={mapRef}
                    customPopup={customPopup}
                    hideCustomPopup={hideCustomPopup}
                    getGradientByActivityType={getGradientByActivityType}
                />

                {itineraryOverlay && (
                    <MapLegend />
                )}
            </div>

            <MapInstructions
                showInstructions={showInstructions}
                setShowInstructions={setShowInstructions}
            />
        </div>
    );
}