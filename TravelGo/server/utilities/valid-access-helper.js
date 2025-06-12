/** valid-access-helper.js
 * This file contains helper functions for the TravelGo server routes.
 */

const Itinerary = require("../models/Itineraries");

function hasAccessToItinerary(itinerary, user) {
    return (itinerary.user._id.equals(user._id));
}

module.exports = { hasAccessToItinerary };