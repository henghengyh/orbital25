/** itineraries.js
 * This file contains the Express routes for managing itineraries and activities.
 * CREATE, DELETE and UDPATE itineraries and activities.
 */

//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itineraries");
const authenticateToken = require("../middleware/authenticateToken");

// IMPORTING HELPER MODULES
const email = require("../utilities/email-helper");
const { findItineraryOr404, findActivityOr404 } = require("../utilities/finder-helper");
const { isValidActivity } = require("../utilities/valid-activity-helper");

/** Creatiing a new itinerary 
 * LAMBDA FUNCTION
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
        await savedItinerary.populate('user');
        email.sendCreateEmail(savedItinerary);
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: "Failed to create itinerary" });
    }
});

/** Getting all itineraries */
router.get("/get-all-itineraries", async (req, res) => {
    const { userId } = req.body;

    try {
        const itinerary = await Itinerary.findByUser(userId);
        console.log(itinerary);
        res.status(200).json({ itineraries: itinerary });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/** Updating an itinerary */
router.put("/:itineraryId", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        for (const key in req.body) {
            itinerary[key] = req.body[key];
        }
        await itinerary.save();
    } catch (error) {
        console.error("Error updating itinerary:", error);
        res.status(500).json({ error: "Failed to update itinerary" });
    }
});

/** Removing an itinerary */
router.delete("/:itineraryId", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        await Itinerary.findByIdAndDelete(req.params.itineraryId);
        res.json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete itinerary" });
    }
});

/** Adding an activity */
router.post("/:itineraryId/activities", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        if (!isValidActivity(itinerary, req.body)) {
            res.status(400).json({ error: "Invalid activity" });
            return;
        }

        await itinerary.addActivity(req.body);
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ error: "Failed to add activity" });
    }
});

/** Updating an activity */
router.put("/:itineraryId/activities/:activityId", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        const activity = await findActivityOr404(itinerary, req.params.activityId, res);
        if (!activity) return;
        await itinerary.updateActivity(req.params.activityId, req.body);

        const duration = activity.timeToStart(new Date()).toFixed(2)
        await itinerary.populate('user');
        email.sendUpdateEmail(itinerary, activity, Math.floor(duration));

        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ error: "Failed to update activity" });
        console.error("Error updating activity:", error);
    }
});

/** Removing an activity */
router.delete("/:itineraryId/activities/:activityId", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        await itinerary.removeActivity(req.params.activityId);
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ error: "Failed to remove activity" });
    }
});

/** Getting all activities */
router.get("/:itineraryId/activities", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        res.json(itinerary.activities);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

/** Getting ONE Specific activity */
router.get("/:itineraryId/activities/:activityId", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        const activity = await findActivityOr404(itinerary, req.params.activityId, res);
        if (!activity) return;
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activity" });
    }
});

module.exports = router;