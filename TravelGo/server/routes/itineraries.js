//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itineraries");

/** CREATING A NEW ITINERARY 
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
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: "Failed to create itinerary" });
    }
})

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

// ##################
// HELPER FUNCTION
// ##################

async function findItineraryOr404(itineraryId, res) {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
        res.status(404).json({ error: "Itinerary not found" });
        return null;
    }
    return itinerary;
}

async function findActivityOr404(itinerary, activityId, res) {
    const activity = itinerary.activities.id(req.params.activityId);
    if (!activity) {
        res.status(404).json({ error: "Activity not found" });
        return null;
    }
    return activity;
}

/** Adding an activity */
router.post("/:itineraryId/activities", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
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
        await itinerary.updateActivity(req.params.activityId, req.body); 
    } catch (error) {
        res.status(500).json({ error: "Failed to update activity" });
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

/** Getting ONE Specific activities */
router.get("/:itineraryId/activities/:activityId", async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) return;
        const activity = await findActivityor404(itinerary, req.params.activityId, res);
        if (!activity) return;
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activity" });
    }
});

module.exports = router;