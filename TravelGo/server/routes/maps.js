/**
 * @file maps.js
 * @route /maps
 * 
 * This file contains the following routes:
 * 1. GET /search-locations - Search for locations using Google Places API
 * 2. GET /location-details/:placeId - Get location details by place ID
 * 3. GET /transport-warning - Get Transport Warning for FrontEnd to Flag, warning Obhect 
 * 4. GET /itinerary-overlay/:itineraryId - Get itinerary data for map overlay
 */

const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

// IMPORTING HELPER MODULES
const Activity = require("../models/Activity");
const { findItineraryOr404, findActivityOr404 } = require("../utilities/finder-helper");
const { hasAccessToItinerary } = require("../utilities/valid-access-helper");
const { searchPlaces, getPlaceDetails, transportActivityToMapData, otherActivitiesToMapData, consecutiveActivitiesToMapData } = require("../utilities/map-helper");

/** Search for locations using Google Places API */
router.get("/search-locations", authenticateToken, async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({ error: "Search query must be at least 2 characters" });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Google Places API key not configured" });
        }

        const places = await searchPlaces(query.trim(), apiKey);
        return res.status(200).json({ places });
    } catch (error) {
        console.error("Error searching locations:", error);
        return res.status(500).json({ error: "Failed to search locations" });
    }
});

/** Get location details by place ID */
router.get("/location-details/:placeId", authenticateToken, async (req, res) => {
    try {
        const { placeId } = req.params;
        
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Google Places API key not configured" });
        }

        const placeDetails = await getPlaceDetails(placeId, apiKey);
        return res.status(200).json({ place: placeDetails });
    } catch (error) {
        console.error("Error getting location details:", error);
        return res.status(500).json({ error: "Failed to get location details" });
    }
});

/** Get Transport Warning based on activity's current status */
router.get("/transport-warning", authenticateToken, async (req, res) => {
    try {
        const activity = JSON.parse(req.query.activity);

        const activitySchemaObject = new Activity(activity);

            //TRANSPORT CHECK
        if (activity.type !== 'Transport') {
            return res.status(400).json({ 
                error: "Transport warning is only available for Transport activities" 
            });
        }
        const warningInfo = activitySchemaObject.transportWarning();
        return res.status(200).json({
            activityId: activity._id,
            activityName: activity.activityName,
            transportWarning: warningInfo
        });        

    } catch (error) {
        console.error("Error getting transport warning:", error);
        return res.status(500).json({ error: "Failed to get transport warning information" });
    }
});

/** Get itinerary data for map overlay */
router.get("/itinerary-overlay/:itineraryId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const { itineraryId } = req.params;
        const { date } = req.query;
        const itinerary = await findItineraryOr404(itineraryId, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        }

        let activities = itinerary.activities.sort((a, b) => {
            if (a.startTime < b.startTime) return -1;
            if (a.startTime > b.startTime) return 1;
            return 0;
        });

        if (date) {
            activities = activities.filter(activity => {
                const equals = new Date(activity.date).toString() === new Date(date).toString();
                return equals;
            });
        }

        const mapData = {
            itineraryId: itinerary._id,
            itineraryName: itinerary.itineraryName,
            activities: [],
            routes: [],
            bounds: null,
            stats: {
                totalActivities: 0,
                activitiesWithLocation: 0,
                transportActivities: 0,
            }
        };

        const locationsForBounds = [];
        let previousActivity = null;

        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            const activityData = {
                id: activity._id,
                name: activity.activityName,
                type: activity.type,
                startTime: activity.startTime,
                endTime: activity.endTime,
                date: activity.date,
                notes: activity.notes,
                location: null,
                transport: null,
                warnings: []
            };
            if (activity.type === 'Transport' && activity.transport) {
                transportActivityToMapData(activityData, activity, locationsForBounds, mapData);
            } else if (activity.location) {
                otherActivitiesToMapData(activityData, activity, locationsForBounds, mapData);
            }

            if (previousActivity && activityData.location?.coordinates && previousActivity.location?.coordinates) {
                consecutiveActivitiesToMapData(previousActivity, activityData, mapData);
            }

            mapData.activities.push(activityData);
            mapData.stats.totalActivities++;
            previousActivity = activityData.location ? activityData : previousActivity;
        }

        if (locationsForBounds.length > 0) {
            const lats = locationsForBounds.map(loc => loc.lat);
            const lngs = locationsForBounds.map(loc => loc.lng);
            
            mapData.bounds = {
                north: Math.max(...lats),
                south: Math.min(...lats),
                east: Math.max(...lngs),
                west: Math.min(...lngs),
                center: {
                    lat: (Math.max(...lats) + Math.min(...lats)) / 2,
                    lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
                }
            };
        }

        return res.status(200).json(mapData);

    } catch (error) {
        console.error("Error getting itinerary overlay data:", error);
        return res.status(500).json({ error: "Failed to get itinerary overlay data" });
    }
});


module.exports = router;