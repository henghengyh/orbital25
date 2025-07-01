/** finder-helper.js
 * This file contains helper functions for the TravelGo server routes.
 */

const Itinerary = require("../models/Itineraries");
const Budget = require("../models/Budget");

async function findItineraryOr404(itineraryId, res) {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
        res.status(404).json({ error: "Itinerary not found" });
        return null;
    }
    return itinerary;
}

async function findActivityOr404(itinerary, activityId, res) {
    const activity = itinerary.activities.find(a => a._id.toString() === activityId.toString());
    if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return null;
    }
    return activity;
}

async function findBudgetOr404(itineraryId, res) {
    const budget = await Budget.findOne({ itineraryId });
    if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return null;
    }
    return budget;
}

module.exports = {
    findItineraryOr404,
    findActivityOr404,
    findBudgetOr404,
};