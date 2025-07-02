/** finder-helper.js
 * This file contains helper functions for the TravelGo server routes.
 */

const Itinerary = require("../models/Itineraries");
const Invitation = require("../models/Invitation");

async function findItineraryOr404(itineraryId, res) {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
        res.status(404).json({ error: "Itinerary not found" });
        return null;
    }
    return itinerary;
}

async function findActivityOr404(itinerary, activityId, res) {
    const activity = await itinerary.activities.find(a => a._id.toString() === activityId.toString());
    if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return null;
    }
    return activity;
}

async function findInvitationOr404(token, status, res) {
    const invitation = await Invitation.findOne({ token, status: 'Pending' });
    if (!invitation) {
        res.status(404).json({ error: "Invitation not found" });
        return null;
    }
    return invitation;
}

module.exports = {
    findItineraryOr404,
    findActivityOr404,
    findInvitationOr404
};