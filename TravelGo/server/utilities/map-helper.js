const axios = require('axios');

/**
 * Search for places using Google Maps API
 * @param {string} query - Search query
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Array>} - Array of place suggestions
 */
async function searchPlaces(query, apiKey) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: query,
                key: apiKey,
                types: 'establishment|geocode',
                language: 'en'
            }
        });

        return response.data.predictions.map(prediction => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text
        }));
    } catch (error) {
        console.error('Error searching places:', error);
        throw new Error('Failed to search places');
    }
}

/**
 * Get place details by place ID
 * @param {string} placeId - Google Place ID
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Object>} - Place details
 */
async function getPlaceDetails(placeId, apiKey) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                key: apiKey,
                fields: 'name,formatted_address,geometry'
            }
        });

        const place = response.data.result;
        return {
            name: place.name,
            address: place.formatted_address,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
        };
    } catch (error) {
        console.error('Error getting place details:', error);
        throw new Error('Failed to get place details');
    }
}

/**
 * Calculate travel time between two locations using Google Distance Matrix API
 * @param {Object} startLoc - Start location with coordinates
 * @param {Object} endLoc - End location with coordinates  
 * @param {String} mode - Mode of transport ('walking', 'driving', 'transit')
 * @param {String} apiKey - Google Maps API key
 * @returns {Promise<Number>} - Travel time in minutes
 */
async function calculateTravelTime(startLoc, endLoc, mode, apiKey) {
    try {
        const origin = startLoc.getCoordinatesString();
        const destination = endLoc.getCoordinatesString();
        
        //as our implementation has a different naming convention for modes
        //we map them to the Google Maps API equivalents
        const modeMapping = {
            'walk': 'walking',
            'car': 'driving', 
            'public': 'transit'
        };
        
        const googleMode = modeMapping[mode] || 'driving';
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: origin,
                destinations: destination,
                mode: googleMode,
                key: apiKey,
                units: 'metric'
            }
        });

        const element = response.data.rows[0]?.elements[0];
        
        if (element?.status === 'OK' && element.duration) {
            return Math.round(element.duration.value / 60);
        } else {
            throw new Error(`Unable to calculate travel time: ${element?.status}`);
        }
    } catch (error) {
        console.error('Error calculating travel time:', error);
        throw new Error('Failed to calculate travel time');
    }
}

module.exports = {
    searchPlaces,
    getPlaceDetails,
    calculateTravelTime
};