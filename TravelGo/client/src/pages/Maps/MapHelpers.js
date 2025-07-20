const getMarkerIconByActivityType = (type) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    const icons = {
        'Meal': `${baseUrl}restaurant.png`,
        'Transport': `${baseUrl}bus.png`,
        'Sightseeing': `${baseUrl}camera.png`,
        'Shopping': `${baseUrl}shopping.png`,
        'Other': `${baseUrl}purple-dot.png`
    };
    return {
        url: icons[type] || `${baseUrl}red-dot.png`,
        scaledSize: new window.google.maps.Size(48, 48)
    };
};

const getColorByTransportMode = (mode) => {
    const colors = {
        'walk': '#4CAF50',
        'car': '#FF5722',
        'public': '#2196F3'
    };
    return colors[mode] || '#757575';
};

const getGradientByActivityType = (type) => {
        const colors = {
            'Meal': '#ff6b6b',
            'Transport': '#4ecdc4',
            'Sightseeing': '#667eea',
            'Shopping': '#ffc048',
            'Other': '#d299c2'
        };
        return colors[type] || '#667eea';
    };

/**
 * Searches for places using Google Maps Places API and adds markers to the map
 * 
 * @function searchPlaces
 * @description Performs a text search for places, clears existing search markers,
 * and adds new yellow markers for search results with info windows
 * 
 * @param {string} query - The search query string
 * @param {google.maps.Map} map - The Google Maps instance
 * @param {Array} markers - Current array of markers on the map
 * @param {Function} setMarkers - State setter function to update markers array
 * 
 * @returns {Promise<Array>} - Promise that resolves to array of new search markers
 * 
 * @throws {Error} When Google Places API call fails
 * 
 */
const searchPlaces = async (query, map, markers, setMarkers) => {
    if (!map || !query) return [];

    return new Promise((resolve, reject) => {
        try {
            markers.forEach(marker => {
                if (marker.getTitle() !== "Your Location" && !marker.getLabel()) {
                    marker.setMap(null);
                }
            });

            const service = new window.google.maps.places.PlacesService(map);
            const searchRequest = {
                query: query,
                fields: ['name', 'geometry', 'place_id', 'formatted_address']
            };

            service.textSearch(searchRequest, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    const newSearchMarkers = [];
                    
                    results.slice(0, 5).forEach((place) => {
                        const marker = new window.google.maps.Marker({
                            position: place.geometry.location,
                            map: map,
                            title: place.name,
                            icon: {
                                url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                                scaledSize: new window.google.maps.Size(35, 35)
                            }
                        });
                        const infoWindow = new window.google.maps.InfoWindow({
                            content: `
                                <div style="padding: 10px;">
                                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">${place.name}</h3>
                                    <p style="margin: 0; font-size: 14px; color: #666;">${place.formatted_address}</p>
                                </div>
                            `
                        });

                        marker.addListener('click', () => {
                            infoWindow.open(map, marker);
                        });

                        newSearchMarkers.push(marker);
                    });

                    const filteredMarkers = markers.filter(m => 
                        m.getLabel() || m.getTitle() === "Your Location"
                    );
                    setMarkers([...filteredMarkers, ...newSearchMarkers]);

                    if (results[0]) {
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(15);
                    }

                    resolve(newSearchMarkers);
                } else {
                    console.error('Places search failed:', status);
                    reject(new Error(`Search failed: ${status}`));
                }
            });

        } catch (error) {
            console.error('Error searching places:', error);
            reject(error);
        }
    });
};

/** 
 * Converts the data into a viewable format on the map.
 * 
 * @function displayItineraryOnMap
 * @description Displays the itinerary on the map by adding markers and polylines for activities and transport routes.
 * 
 * @param {Object} itineraryData - The itinerary data containing activities and routes.
 * @param {Array} itineraryData.activities - List of activities in the itinerary.
 * @param {Array} itineraryData.routes - List of routes between activities.
 * @param {Object} itineraryData.bounds - The bounds for the map view.
 * @param {Object} itineraryData.bounds.stats - The statistics for the itinerary.
 */
const displayItineraryOnMap = (
    itineraryData, 
    map, 
    clearItineraryOverlay, 
    showCustomPopup, 
    setMarkers, 
    setPolylines
) => {
    if (!map || !itineraryData) return;
    clearItineraryOverlay();
    
    const newMarkers = [];
    const newPolylines = [];

    itineraryData.activities.forEach((activity, index) => {
        let coordinates = null;
        let title = activity.name;
        
        if (activity.location?.coordinates) {
            coordinates = activity.location.coordinates;
        } else if (activity.transport?.startLocation?.coordinates) {
            coordinates = activity.transport.startLocation.coordinates;
            title = `${activity.name} (Start)`;
        }
        
        if (coordinates) {
            const markerNumber = newMarkers.length + 1;
            
            const baseIcon = getMarkerIconByActivityType(activity.type);
            const marker = new window.google.maps.Marker({
                position: coordinates,
                map: map,
                title: title,
                icon: baseIcon,
                label: {
                    text: markerNumber.toString(),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    className: 'custom-marker-label'
                }
            });
                
            marker.addListener('click', (event) => {
                showCustomPopup(activity, event.latLng, markerNumber);
            });
            newMarkers.push(marker);
        }
    });
    
    itineraryData.activities.forEach(activity => {
        if (activity.transport?.startLocation?.coordinates && activity.transport?.endLocation?.coordinates) {
            const transportRoute = new window.google.maps.Polyline({
                path: [
                    activity.transport.startLocation.coordinates,
                    activity.transport.endLocation.coordinates
                ],
                geodesic: true,
                strokeColor: getColorByTransportMode(activity.transport.modeOfTransport),
                strokeOpacity: 0.8,
                strokeWeight: 4
            });
            
            transportRoute.setMap(map);
            newPolylines.push(transportRoute);
        }
    });

    itineraryData.routes.forEach(route => {
        const routePath = new window.google.maps.Polyline({
            path: [route.from.coordinates, route.to.coordinates],
            geodesic: true,
            strokeColor: '#4285F4',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            icons: [{
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 2
                },
                offset: '0',
                repeat: '20px'
            }]
        });
        
        routePath.setMap(map);
        newPolylines.push(routePath);
    });
    
    if (itineraryData.bounds) {
        const bounds = new window.google.maps.LatLngBounds(
            { lat: itineraryData.bounds.south, lng: itineraryData.bounds.west },
            { lat: itineraryData.bounds.north, lng: itineraryData.bounds.east }
        );
        map.fitBounds(bounds);
    }
    setMarkers(newMarkers);
    setPolylines(newPolylines);
};

export {
    getMarkerIconByActivityType,
    getColorByTransportMode,
    getGradientByActivityType,
    searchPlaces,
    displayItineraryOnMap
};