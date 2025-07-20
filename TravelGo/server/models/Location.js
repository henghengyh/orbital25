const mongoose = require("mongoose");
const { getPlaceDetails } = require("../utilities/map-helper");

/** LocationSchema
 * @param {String} placeId - Google Places API place ID
 * @param {String} description - Human-readable place description
 * @param {Object} coordinates - Lat/lng coordinates for calculations
 */
const LocationSchema = new mongoose.Schema({
    placeId: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        lng: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    }
});

/** INSTANCE METHODS */

/** getCoordinatesString
 * @returns {String} - lattitude,longtiude format for Google APIs
 */
LocationSchema.methods.getCoordinatesString = function(precision = 6) {
    const lat = Number(this.coordinates.lat).toFixed(precision);
    const lng = Number(this.coordinates.lng).toFixed(precision);
    return `${lat},${lng}`;
};

/** STATIC METHODS */

/** createFromGoogleResponse
 * @param {Object} input - Google Maps API response
 * @returns {LocationSchema} - New Location instance
 */
LocationSchema.statics.createFromGoogleResponse = async function(input) {
    const placeID = input.placeId;
    const res = await getPlaceDetails(placeID, process.env.GOOGLE_MAPS_API_KEY);
    return new this({
        placeId: input.placeId,
        description: input.description,
        coordinates: {
            lat: res.lat,
            lng: res.lng
        }
    });
};

const Location = mongoose.model("Location", LocationSchema);

module.exports = { Location, LocationSchema };