const mongoose = require("mongoose");
const { ActivitySchema } = require("./Activity");

/** NOTES to Frontend Developer HAOHAOOOOOO:
 * You should consider the possibility of 
 * including optional activities and notes. 
 * On top of the compulsory fields below to 
 * create an itinerary.
*/

/** ItinerarySchema
 * @param {ObjectId} user - User ID Object
 * @param {string} destination - Destination
 * @param {string} imageUrl - url of image from Gemini AI based on destination
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date //Date is a built-in JavaScript object that represents a single moment in time
 * @param {number} numberOfPeople - Number of people
 * @param {Array} activities - Array of ActivitySchema
 * @param {string} notes - Additional notes, optional
 */
const ItinerarySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripName: { type: String, required: true },
    destination: { type: String, required: true },
    imageNumber: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfPeople: { type: Number, default: 1 },
    activities: { type: [ActivitySchema], default: [] },
    notes: { type: String, default: "" }
}, { timestamps: true });

ItinerarySchema.index({ user: 1});
ItinerarySchema.index({ user: 1, startDate: 1, endDate: 1});
ItinerarySchema.index({ user: 1, tripName: 1, destination: 1});

/** INSTANCE METHODS */

ItinerarySchema.methods.getUser = async function () {
    // LEARNING POINT: .populate() is asynchronus, returns Promise 
    // it replaces the ObjectId referenced with
    // the actual UserSchema object
    await this.populate('user');
    return this.user;
}

ItinerarySchema.methods.getDestination = function () {
    return this.destination;
}

ItinerarySchema.methods.getTripDuration = function (includeStart = false) {
    let duration = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    return includeStart ? duration + 1 : duration;
}

ItinerarySchema.methods.getActivitiesByType = function (type) {
    return this.activities.filter(x => x.isOfType(type));
}

ItinerarySchema.methods.getActivitiesForDate = function (date) {
    return this.activities.filter(x => x.isOnDate(date));
};

ItinerarySchema.methods.addActivity = async function (activity) {
    this.activities.push(activity);
    await this.save();
    return this;
}

ItinerarySchema.methods.removeActivity = async function (activityId) {
    const n = this.activities.findIndex((x) => x._id.toString() == activityId.toString());
    this.activities.splice(n, 1);
    await this.save();
    return this;
};

ItinerarySchema.methods.updateActivity = function (activityId, updatedFields) {
    const activity = this.activities.find(a => a._id.toString() === activityId.toString());
    if (activity) {
        Object.assign(activity, updatedFields);
        activity.markModified && activity.markModified();
        this.markModified('activities');
        return this.save();
    } else {
        throw new Error("Activity not found");
    }
};

ItinerarySchema.methods.moveActivity = function (activityId, newIndex) {
    const idx = this.activities.findIndex(a => a._id.toString() === activityId.toString());
    if (idx === -1) throw new Error("Activity not found");

    // what happens here is we remove the activity from its current pos
    const [activity] = this.activities.splice(idx, 1);

    // thenw e insert it in
    this.activities.splice(newIndex, 0, activity);
    return this.save();
};

ItinerarySchema.methods.occursOnTrip = function (activity) {
    const itineraryStart = new Date(this.startDate);
    const itineraryEnd = new Date(this.endDate);
    const activityDate = new Date(activity.date);

    return activityDate >= itineraryStart && activityDate <= itineraryEnd;
}

/** STATIC METHODS
 * To be invoked on the ItinerarySchema model (resembles a class in Java)
 * But can directly access the entire collection of itineraries in our MongoDB database
 */

ItinerarySchema.statics.findByUser = function (userId) {
    return this.find({ user: userId });
};

ItinerarySchema.statics.findByDestination = function (destination) {
    return this.find({ destination });
};

module.exports = mongoose.model('Itinerary', ItinerarySchema);