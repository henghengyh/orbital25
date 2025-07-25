/** valid-access-helper.js
 * This file contains helper functions for the TravelGo server routes.
 */
function hasAccessToItinerary(itinerary, user) {
    if (itinerary.user._id.equals(user._id)) return true;
    if (Array.isArray(itinerary.collaborators)) {
        return itinerary.collaborators.some(collabId =>
            collabId.equals ? collabId.equals(user._id) : String(collabId) === String(user._id)
        );
    }
    return false;
}

module.exports = { hasAccessToItinerary };