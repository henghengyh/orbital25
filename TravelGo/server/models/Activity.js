const mongoose = require("mongoose");
const typeOfActivities = ["meal", "sightseeing", "transport", "shopping", "other"]

/** ActivitySchema
 * @param {String} name - username
 * @param {Date} date - date of activity (currently supports only one date)
 * @param {String} startTime 
 * @param {String} endTime 
 * @param {String} type - type of activity (e.g. meal, sightseeing)
 * @param {String} notes - remarks
 */
const ActivitySchema = new mongoose.Schema({
    name: String,
    date: Date,
    startTime: String,
    endTime: String,
    type: {
        type: String,
        enum: typeOfActivities, 
        required: true
    },
    notes: String,
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

/** isOfType
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

/** STATIC METHODS */

/** getActivity
 * @param {String} activityId - ID of the activity to retrieve
 * @returns {Promise<ActivitySchema>} - Promise
 * @description Should use only when doing top-level operations in MongoDB
 */
ActivitySchema.statics.getActivity = function(activityId) {
    return this.findById(activityId);
};

ActivitySchema.statics.newActivity = function(activityData) {
    return new this(activityData);
};

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;