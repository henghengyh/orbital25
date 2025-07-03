/**
 * @file budget.js
 * @route /budget
 * 
 * This file contains the following route:
 * 1. POST / - create a new budget
 * 2. GET /:itineraryId - get budget
 * 3. PUT /:itineraryId - update budget
 */

const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Budget = require("../models/Budget");

const { findBudgetOr404 } = require("../utilities/finder-helper");

/** Create a new budget for the itinerary */
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { itineraryIdString, budget } = req.body;

        const itineraryId = new mongoose.Types.ObjectId(itineraryIdString);
        const existingBudget = await Budget.findOne({ itineraryId });
        if (existingBudget) return res.status(409).json({ error: "Budget already exists for this itinerary" });

        const newBudget = new Budget({ itineraryId, budget });
        await (await newBudget.save()).populate('itineraryId');
        return res.status(200).json({ message: "Budget added" });
    } catch (err) {
        console.error("Error adding budget:", err);
        return res.status(500).json({ error: "Failed to add budget" });
    }
});

/** Get budget set for the itinerary */
router.get("/:itineraryId", authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const budget = await Budget.find({ itineraryId }).select({ budget: 1 });
        return res.status(200).json({ budget });
    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
});

/** Edit budget set for the itinerary */
router.put("/:itineraryId", authenticateToken, async (req, res) => {
    try {
        const budget = await findBudgetOr404(req.params.itineraryId, res);
        if (!budget) {
            return;
        } else {
            budget["budget"] = req.body["budget"];
            await budget.save();
            return res.status(200).json({ message: "Budget updated", budget: budget.budget });
        }
    } catch (err) {
        console.error("Error updating budget:", err);
        return res.status(500).json({ error: "Failed to update budget" });
    }
});

module.exports = router;