const mongoose = require("mongoose");

/** BudgetSchema
 * @param {ObjectId} itineraryId - itinerary ID object
 * @param {Number} budget - budget set for the itinerary
 * @param {String} itineraryTitle - itinerary title
 */
const BudgetSchema = new mongoose.Schema({
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", required: true, unique: true },
    budget: { type: Number, default: 1, required: true },
    itineraryTitle: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);