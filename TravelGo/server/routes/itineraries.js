//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itineraries");

/** LAMBDA FUNCTION
 * @param {string}} req - The request object containing new itinerary request data.
 * @param {Object} res - The response object used to send a response to frontend.
 */
router.post("/", async (req, res) => {
    try {
        const { userId, destination, startDate, endDate, numberOfPeople } = req.body;
        const newItinerary = new Itinerary({
            user: userId,
            destination,
            startDate,
            endDate,
            numberOfPeople
        });
        const savedItinerary = await newItinerary.save();
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: "Failed to create itinerary" });
    }
})