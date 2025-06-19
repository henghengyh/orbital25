/** valid-activity-helper.js
 * To check if an activity is valid for a given itinerary
 */

function isValidActivity(itinerary, activity) {

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

    let counter = 0;
    for (const existingActivity of itinerary.activities) {
        if (new Date(existingActivity.date).toDateString() !== new Date(activity.date).toDateString()) continue;

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

module.exports = { isValidActivity };