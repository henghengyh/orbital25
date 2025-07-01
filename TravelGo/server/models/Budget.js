const mongoose = require("mongoose");

/** BudgetSchema
 * @param {ObjectId} itineraryId - itinerary ID object
 * @param {Number} budget - budget set for the itinerary
 */
const BudgetSchema = new mongoose.Schema({
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", required: true, unique: true },
    budget: { type: Number, default: 1, required: true },
}, { timestamps: true });

BudgetSchema.index({ itineraryId: 1 });

module.exports = mongoose.model("Budget", BudgetSchema);