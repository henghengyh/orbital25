const mongoose = require("mongoose");

/** ExpensesSchema
 * @param {ObjectId} user - user ID object
 * @param {String} itineraryId - itinerary ID
 * @param {Date} date - date of expenses made
 * @param {Number} amount - amount of expenses
 * @param {String} type - type of expenses
 * @param {String} whoPaid - who paid for the expenses
 * @param {String} notes - additional notes, optional
 */
const ExpensesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itineraryId: { type: String, required: true },
    date: { type: Date, default: Date.now(), required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    whoPaid: { type: String, required: true },
    notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Expenses", ExpensesSchema);