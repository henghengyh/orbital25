const mongoose = require("mongoose");
const { Location, LocationSchema } = require("./Location");
const { calculateTravelTime } = require('../utilities/map-helper');
const typeOfActivities = ["Meal", "Shopping", "Sightseeing", "Transport", "Other"];

/** ActivitySchema
 * @param {String} activityName - name of activity
 * @param {Date} date - date of activity (currently supports only one date)
 * @param {String} startTime 
 * @param {String} endTime 
 * @param {String} type - type of activity (e.g. meal, sightseeing)
 * @param {String} notes - remarks
 * @param {Object} transport 
 * @param {Number} transport.recommendedTravelTime - recommended travel time in minutes
 * @param {String} transport.modeOfTransport - mode of transport 
 * @param {Object} transport.startLoc - start location
 * @param {Object} transport.endLoc - end location
 * @param {Boolean} transport.travelDurationPass - if it exceeds
 */
const ActivitySchema = new mongoose.Schema({
    activityName: String,
    date: Date,
    startTime: String,
    endTime: String,
    type: {
        type: String,
        enum: typeOfActivities, 
        required: true
    },
    notes: String,
    transport: {
        recommendedTravelTime: {
            type: Number,
            default: null
        },
        modeOfTransport: {
            type: String,
            enum: [null, "walk", "car", "public"],
            default: null
        },
        startLoc: {
            type: LocationSchema,
            default: null
        },
        endLoc: {
            type: LocationSchema,
            default: null
        },
        travelDurationPass: {
            type: Boolean,
            default: true
        }
    }
}); 

/** INSTANCE METHODS */

/** updateActivity
 * @param {Object} updatedFields - Object contains fields TBU
 * @returns {Promise<ActivitySchema>} - Promise
 */
ActivitySchema.methods.updateActivity = function(updatedFields) {
    Object.assign(this, updatedFields);
};

/** isOfType
 * @param {String} type - new type to compare
 * @returns {Boolean}
 */
ActivitySchema.methods.isOfType = function(type) {
    return this.type === type;
}

/** isOnDate
 * @param {String} date - new date to compare
 * @returns {Boolean}
 */
ActivitySchema.methods.isOnDate = function(date) {
    return this.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10);
}

ActivitySchema.methods.timeToStart = function(now = new Date()) {
    const [hours, minutes] = this.startTime.split(':').map(Number);
    const activityStart = new Date(this.date);
    activityStart.setHours(hours, minutes, 0, 0);

    const diffMs = activityStart - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
};

ActivitySchema.methods.getActivityDuration = function() {
    const [startHours, startMinutes] = this.startTime.split(':').map(Number);
    const [endHours, endMinutes] = this.endTime.split(':').map(Number);
    const startDate = new Date(this.date);
    startDate.setHours(startHours, startMinutes, 0, 0);
    const endDate = new Date(this.date);
    endDate.setHours(endHours, endMinutes, 0, 0);
    return (endDate - startDate) / (1000 * 60 * 60); 
}

/** calculateRecommendedTravelTime
 * @returns {Number} - API calculated recommended travel time
 */
ActivitySchema.methods.calculateRecommendedTravelTime = async function() {
    // Only calculate if all required fields are present
    if (!this.transport?.startLoc || !this.transport?.endLoc || !this.transport?.modeOfTransport) {
        this.transport.recommendedTravelTime = null;
        return null;
    }
    
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            throw new Error('Google Maps API key not configured');
        }
        
        const travelTime = await calculateTravelTime(
            this.transport.startLoc,
            this.transport.endLoc, 
            this.transport.modeOfTransport,
            apiKey
        );
        
        this.transport.recommendedTravelTime = travelTime;
        return travelTime;
    } catch (error) {
        console.error('Error calculating recommended travel time:', error);
        this.transport.recommendedTravelTime = null;
        return null;
    }
};

/** getRecommendedTravelTime
 * @returns {Number} - recommended travel time (mins)
 */
ActivitySchema.methods.getRecommendedTravelTime = function() {
    return this.transport?.recommendedTravelTime || null;
};

/** updateTravelDurationPass
 * Updates travelDurationPass based on difference between recommended and actual duration
 * @returns {Boolean} - Updated travelDurationPass value
 */
ActivitySchema.methods.updateTravelDurationPass = function() {
    const recommendedTime = this.getRecommendedTravelTime();
    
    if (recommendedTime === null) {
        this.transport.travelDurationPass = true;
        return true;
    }
    
    const activityDuration = this.getActivityDuration() * 60; 
    const timeDifference = Math.abs(recommendedTime - activityDuration);
    
    // The threshold chosen by our team is 30mins
    this.transport.travelDurationPass = timeDifference <= 30;
    return this.transport.travelDurationPass;
};

/** hasLocationChanged
 * Checks if start or end location has changed compared to another activity
 * @param {Object} otherActivity - Activity to compare with
 * @returns {Boolean} - Whether locations have changed
 */
ActivitySchema.methods.hasLocationChanged = function(otherActivity) {
    const currentStartId = this.transport?.startLoc?.placeId;
    const currentEndId = this.transport?.endLoc?.placeId;
    const otherStartId = otherActivity.transport?.startLoc?.placeId;
    const otherEndId = otherActivity.transport?.endLoc?.placeId;
    
    return currentStartId !== otherStartId || currentEndId !== otherEndId;
};

/** hasTimeChanged
 * Checks if start time, end time, or date has changed compared to another activity
 * @param {Object} otherActivity - Activity to compare with
 * @returns {Boolean} - Whether time-related fields have changed
 */
ActivitySchema.methods.hasTimeChanged = function(otherActivity) {
    if (!otherActivity) return true;
    
    const currentDate = this.date.toString() || this.date;
    const otherDate = otherActivity.date.toString() || otherActivity.date;
    
    return this.startTime !== otherActivity.startTime ||
           this.endTime !== otherActivity.endTime ||
           currentDate !== otherDate;
};

/** transportWarning
 * @returns {Object} - a javaScript object containing the warning info
 * @returns {Boolean} .travelDurationPass - whether travel duration passes
 * @returns {Number} .recommendedTravelTime - recommended travel time in minutes
 * @returns {Number} .getActivityDuration - duration of the activity in minutes
 * @returns {String} .message - warning message if travel duration pass fails
 */
ActivitySchema.methods.transportWarning = function() {
    const recommendedTime = this.getRecommendedTravelTime();
    const activityDuration = this.getActivityDuration() * 60; 
    const travelDurationPass = this.transport?.travelDurationPass;
    
    let message = null;
    if (recommendedTime && !travelDurationPass) {
        const timeDiff = Math.abs(recommendedTime - activityDuration);
        message = `Warning: Your allocated time (${Math.round(activityDuration)} min) differs from recommended travel time (${recommendedTime} min) by ${Math.round(timeDiff)} minutes.`;
    }
    
    return {
        travelDurationPass,
        recommendedTravelTime: recommendedTime,
        activityDuration: Math.round(activityDuration),
        message
    };
};

/** STATIC METHODS */

/** getActivity
 * @param {String} activityId - ID of the activity to retrieve
 * @returns {Promise<ActivitySchema>} - Promise
 * @description Should use only when doing top-level operations in MongoDB
 */
ActivitySchema.statics.getActivity = function(activityId) {
    return this.findById(activityId);
};

ActivitySchema.statics.newActivity = async function(activityData) {

    if (activityData.type != "Transport" ||
        !activityData.transport || 
        !activityData.transport.startLoc || 
        !activityData.transport.endLoc) {
        // If no transport locations, create activity as-is
        return new this(activityData);
    }

    const inputStartLoc = activityData.transport?.startLoc;
    const inputEndLoc = activityData.transport?.endLoc;

    const startLoc = await Location.createFromGoogleResponse(inputStartLoc);
    const endLoc = await Location.createFromGoogleResponse(inputEndLoc);
    const processedData = {
        ...activityData,
        transport: {
            ...activityData.transport,
            startLoc: startLoc,
            endLoc: endLoc
        }
    }
    return new this(processedData);
};

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;