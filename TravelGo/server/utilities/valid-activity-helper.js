/** valid-activity-helper.js
 * To check if an activity is valid for a given itinerary
 */

function isValidActivity(itinerary, activity) {

    //FIRST LAYER CHECK #####################################################
    if (activity.getActivityDuration() <= 0) {
        return false;
    }

    //SECOND LAYER CHECK #####################################################
    if (!itinerary.occursOnTrip(activity)) {
        return false;
    }
    
    //THIRD LAYER CHECK #####################################################
    let counter = 0;
    for (const existingActivity of itinerary.activities) {
        const overlap =
            (new Date(activity.startTime) < new Date(existingActivity.endTime)) &&
            (new Date(activity.endTime) > new Date(existingActivity.startTime));
        if (overlap) {
            if (activity.type !== "other" && existingActivity.type !== "other") {
                return false;
            }
            counter++;
        }
    }

    return counter < 2;
}

module.exports = { isValidActivity };