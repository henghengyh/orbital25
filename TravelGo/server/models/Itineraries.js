const mongoose = require("mongoose");
const { ActivitySchema } = require("./Activity");

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
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tripName: { type: String, required: true },
    destination: { type: String, required: true },
    imageNumber: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfPeople: { type: Number, default: 1 },
    activities: { type: [ActivitySchema], default: [] },
    notes: { type: String, default: "" }
}, { timestamps: true });

ItinerarySchema.index({ user: 1 });
ItinerarySchema.index({ user: 1, startDate: 1, endDate: 1 });
ItinerarySchema.index({ user: 1, tripName: 1, destination: 1 });

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

ItinerarySchema.methods.updateActivity = async function (oldActivity, updatedFields) {
    const fieldsToUpdate = updatedFields.toObject();
    if (oldActivity) {

        Object.assign(oldActivity, fieldsToUpdate);
        
        // Programmer is actually unsure why this is needed
        // It seems to be a workaround for Mongoose not detecting changes
        // A deep google search didn't yield any findings, but recommended this change
        // SO DO NOT DELETE THIS LINE, PLEASE
        if (oldActivity._doc) {
            Object.assign(oldActivity._doc, fieldsToUpdate);
        }

        console.log("After update:", oldActivity);

        //TO highlight the changes in the UI
        oldActivity.markModified && oldActivity.markModified();
        this.markModified('activities');

        await this.save();

        console.log("Final saved activity:", this.activities);
        return this;
    } else {
        throw new Error("Activity not found");
    }
};

ItinerarySchema.methods.occursOnTrip = function (activity) {
    const itineraryStart = new Date(this.startDate);
    const itineraryEnd = new Date(this.endDate);
    const activityDate = new Date(activity.date);

    return activityDate >= itineraryStart && activityDate <= itineraryEnd;
}

ItinerarySchema.methods.getListOfCollaborators = async function () {
    await this.populate('collaborators');
    return this.collaborators.map(c => ({
        name: c.name,
        email: c.email
    }));
}

ItinerarySchema.methods.getOwner = async function () {
    await this.populate('user');
    return {
        userId: this.user._id,
        name: this.user.name,
        email: this.user.email
    };
}

ItinerarySchema.methods.removeCollaborator = async function (userID) {
    this.collaborators = this.collaborators.filter(c => c.toString() !== userID.toString());
    await this.save();
    return this;
}

ItinerarySchema.query.withinDateRange = function(startDate, endDate) {
    if (startDate && endDate) {
        return this.where({
            startDate: { $gte: new Date(startDate) },
            endDate: { $lte: new Date(endDate) }
        });
    }
    return this;
};

ItinerarySchema.query.searchByText = function(searchQuery) {
    if (searchQuery && searchQuery.trim()) {
        const trimmedQuery = searchQuery.trim();

        const result = this.find({
            $and: [
                this.getQuery(),
                {
                    $or: [
                        { tripName: { $regex: new RegExp(trimmedQuery, "i") } },
                        { destination: { $regex: new RegExp(trimmedQuery, "i") } }
                    ]
                }
            ]
        });
        return result;
    }
    return this;
};

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

// Returns query objects NOTT document instances
ItinerarySchema.statics.findAccessibleByUser = function(userId) {
    return this.find({
        $or: [
            { user: userId },
            { collaborators: userId }
        ]
    });
};

module.exports = mongoose.model('Itinerary', ItinerarySchema);