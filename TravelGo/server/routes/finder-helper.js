/** finder-helper.js
 * This file contains helper functions for the TravelGo server routes.
 */

const Itinerary = require("../models/Itineraries");

async function findItineraryOr404(itineraryId, res) {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
        res.status(404).json({ error: "Itinerary not found" });
        return null;
    }
    return itinerary;
}

async function findActivityOr404(itinerary, activityId, res) {
    const activity = itinerary.activities.id(activityId);
    if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return null;
    }
    return activity;
}

module.exports = {
    findItineraryOr404,
    findActivityOr404
};