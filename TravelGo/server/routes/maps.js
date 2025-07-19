/**
 * @file maps.js
 * @route /maps
 * 
 * This file contains the following routes:
 * 1. GET /search-locations - Search for locations using Google Places API
 * 2. GET /location-details/:placeId - Get location details by place ID
 * 3. GET /transport-warning - Get Transport Warning for FrontEnd to Flag, warning Obhect \
 */

const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

// IMPORTING HELPER MODULES
const Activity = require("../models/Activity");
const { findItineraryOr404, findActivityOr404 } = require("../utilities/finder-helper");
const { hasAccessToItinerary } = require("../utilities/valid-access-helper");
const { searchPlaces, getPlaceDetails } = require("../utilities/map-helper");

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

module.exports = router;