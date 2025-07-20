/** valid-activity-helper.js
 * To check if an activity is valid for a given itinerary
 */
const { Location } = require("../models/Location");

async function isValidActivity(itinerary, activity, originalActivity) {
    
    //FIRST LAYER CHECK #####################################################
    if (activity.getActivityDuration() <= 0) return false;

    //SECOND LAYER CHECK #####################################################
    if (!itinerary.occursOnTrip(activity)) return false;

    //THIRD LAYER CHECK #####################################################
    const parseDateTime = (date, timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result;
    }

    //ADDITIONAL CHECKS #####################################################
    if (activity.type === 'Transport') {
        if (!isValidTransportLocations(activity.transport)) {
            return false;
        }
        
        if (!originalActivity || activity.hasTimeChanged(originalActivity) || activity.hasLocationChanged(originalActivity)) {
            await activity.calculateRecommendedTravelTime();
            activity.updateTravelDurationPass();
        }
    } else {
        if (activity.location) {
            const withCoor = await Location.createFromGoogleResponse(activity.location);
            activity.location.coordinates = withCoor.coordinates;
        }
    }

    
    let counter = 0;
    for (const existingActivity of itinerary.activities) {
        if (new Date(existingActivity.date).toDateString() !== new Date(activity.date).toDateString()) continue;
        if (existingActivity._id.toString() === activity._id.toString()) continue;

        const activityStart = parseDateTime(activity.date, activity.startTime);
        const activityEnd = parseDateTime(activity.date, activity.endTime);
        const existingStart = parseDateTime(existingActivity.date, existingActivity.startTime);
        const existingEnd = parseDateTime(existingActivity.date, existingActivity.endTime);

        const overlap = activityStart < existingEnd && activityEnd > existingStart;
        if (overlap) {
            if (activity.type !== "Other" && existingActivity.type !== "Other") {
                return false;
            }
            counter++;
        }
    }

    return counter < 2;
}

/** isValidTransportLocations
 * @param {Object} transport - Transport object with startLoc and endLoc
 * @returns {boolean} - true if transport locations are valid
 */
function isValidTransportLocations(transport) {
    if (!transport) return true;
    if (transport.startLoc && transport.endLoc && 
        transport.startLoc.placeId === transport.endLoc.placeId) {
        console.log("Start and end locations cannot be the same:", transport.startLoc.placeId);
        return false;
    }
    
    return true;
}


module.exports = { isValidActivity, isValidTransportLocations };