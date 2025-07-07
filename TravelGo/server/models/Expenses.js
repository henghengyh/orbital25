const mongoose = require("mongoose");
const typesOfExpenses = ["accommodation", "activities", "food", "gift", "others", "shopping", "transport"];

/** ExpensesSchema
 * @param {ObjectId} itineraryId - itinerary ID
 * @param {String} title - title of expenses made
 * @param {Date} date - date of expenses made
 * @param {Number} amount - amount of expenses (all amount are stored in SGD)
 * @param {String} currency - currency of amount input
 * @param {String} type - type of expenses
 * @param {String} whoPaid - who paid for the expenses
 * @param {String} notes - additional notes, optional
 */
const ExpensesSchema = new mongoose.Schema({
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now(), required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "SGD" },
    type: { type: String, enum: typesOfExpenses, required: true },
    whoPaid: { type: String, required: true },
    notes: { type: String, default: "" },
}, { timestamps: true });

ExpensesSchema.index({ itineraryId: 1 });

module.exports = mongoose.model("Expenses", ExpensesSchema);