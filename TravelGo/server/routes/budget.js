/**
 * @file budget.js
 * @route /budget
 * 
 * This file contains the following route:
 * 1. POST / - create a new budget
 * 2. GET /:itineraryId - get budget
 * 3. PUT /:itineraryId - update budget
 * 4. POST /currency - get latest currency exchange rate
 */

const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const axios = require('axios');

const { findBudgetOr404 } = require("../utilities/finder-helper");

/** Create a new budget for the itinerary */
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { itineraryIdString, budget, itineraryTitle } = req.body;

        const itineraryId = new mongoose.Types.ObjectId(itineraryIdString);
        const existingBudget = await Budget.findOne({ itineraryId });
        if (existingBudget) return res.status(409).json({ error: "Budget already exists for this itinerary" });

        const newBudget = new Budget({ itineraryId, budget, itineraryTitle });
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

        const budget = await Budget.find({ itineraryId }).select({ budget: 1, itineraryTitle: 1 });
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

/** Get latest currency exchange rate */
router.post("/currency", authenticateToken, async (req, res) => {
    try {
        const response = await axios.get('https://api.currencyapi.com/v3/latest', {
            params: {
                apikey: process.env.CURRENCY_API,
                base_currency: "SGD",
            }
        });
        return res.status(200).json(response.data.data);
    } catch (err) {
        console.error("Error retrieving currency:", err);
        return res.status(500).json({ error: "Failed to get currency" });
    }
});

module.exports = router;