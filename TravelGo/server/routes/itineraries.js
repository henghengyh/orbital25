/**
 * @file itineraries.js
 * @route /users
 * 
 * This file contains the following routes:
 * 1. POST / - Create a new itinerary
 * 2. GET /get-all-itineraries - Get all itineraries for the authenticated user
 * 3. GET /search-itineraries - Search for itineraries by
 *    destination or notes
 * 4. GET /filter - Filter itineraries by start and end dates
 * 5. PUT /:itineraryId - Update an itinerary by ID
 * 6. DELETE /:itineraryId - Delete an itinerary by ID
 * 7. POST /:itineraryId/activities - Add an activity
 * 8. PUT /:itineraryId/activities/:activityId - Update an activity by ID
 * 9. DELETE /:itineraryId/activities/:activityId - Remove an activity by ID
 * 10. GET /:itineraryId/activities - Get all activities for an itinerary
 * 11. GET /:itineraryId/activities/:activityId - Get a specific activity by ID
 */

//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itineraries");
const Activity = require("../models/Activity");

// IMPORTING HELPER MODULES
const email = require("../utilities/email-helper");
const { findItineraryOr404, findActivityOr404 } = require("../utilities/finder-helper");
const { isValidActivity } = require("../utilities/valid-activity-helper");
const { hasAccessToItinerary } = require("../utilities/valid-access-helper");

/** Creatiing a new itinerary 
 * LAMBDA FUNCTION
 * @param {string}} req - The request object containing new itinerary request data.
 * @param {Object} res - The response object used to send a response to frontend.
 */
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { tripName, destination, startDate, endDate, numberOfPeople, notes } = req.body;
        const userId = req.user._id;

        const getRndInteger = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const newItinerary = new Itinerary({
            user: userId,
            tripName,
            destination,
            imageNumber: getRndInteger(1, 8),
            startDate,
            endDate,
            numberOfPeople,
            notes
        });
        const savedItinerary = await newItinerary.save();
        await savedItinerary.populate('user');
        try {
            email.sendCreateEmail(savedItinerary);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // At this point, we can still return the saved itinerary even if the email is invalid.
            // Previously, we were throwing an error causing the program to crash.
        }
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: "Failed to create itinerary" });
    }
});

/** Getting all itineraries */
router.get("/get-all-itineraries", authenticateToken, async (req, res) => {
    console.log("Fetching all itineraries");
    const user = req.user;

    try {
        const itinerary = await Itinerary.find({ user: user._id }).sort({ startDate: 1 });
        res.status(200).json({ itineraries: itinerary });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/** Search for itineraries */
router.get("/search-itineraries", authenticateToken, async (req, res) => {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query required." })
    }

    try {
        const matchingItinerary = await Itinerary.find({
            user: user._id,
            $or: [
                { destination: { $regex: new RegExp(query, "i") } },
                { notes: { $regex: new RegExp(query, "i") } }
            ],
        }).sort({ startDate: 1 });
        return res.status(200).json({ itineraries: matchingItinerary });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/** Filter itineraries */
router.get("/filter", authenticateToken, async (req, res) => {
    const user = req.user;
    const { start, end } = req.query;

    try {
        const matchingItinerary = await Itinerary.find({
            user: user._id,
            startDate: { $gte: new Date(Number(start)) },
            endDate: { $lte: new Date(Number(end)) }
        }).sort({ startDate: 1 });
        return res.status(200).json({ itineraries: matchingItinerary, message: "Itinerary found successfully." });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

/** Updating an itinerary */
router.put("/:itineraryId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        } else {
            for (const key in req.body) {
                itinerary[key] = req.body[key];
            }
            await itinerary.save();
            res.status(200).json(itinerary);
        }
    } catch (error) {
        console.error("Error updating itinerary:", error);
        res.status(500).json({ error: "Failed to update itinerary" });
    }
});

/** Removing an itinerary */
router.delete("/:itineraryId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        } else {
            await Itinerary.findByIdAndDelete(req.params.itineraryId);
            res.json({ message: "Itinerary deleted successfully" });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to delete itinerary" });
    }
});

/** Adding an activity */
router.post("/:itineraryId/activities", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        }

        const x = Activity.newActivity(req.body);
        if (!isValidActivity(itinerary, x)) {
            res.status(400).json({ error: "Invalid activity" });
            return;
        }
        await itinerary.addActivity(x);
        res.status(201).json(itinerary);
    } catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).json({ error: "Failed to add activity" });
    }
});

/** Updating an activity */
router.put("/:itineraryId/activities/:activityId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        } else {
            const activity = await findActivityOr404(itinerary, req.params.activityId, res);
            if (!activity) return;
            await itinerary.updateActivity(req.params.activityId, req.body);

            const duration = activity.timeToStart(new Date()).toFixed(2)
            await itinerary.populate('user');

            try {
                email.sendUpdateEmail(itinerary, activity, Math.floor(duration));
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                // At this point, we can still return the saved itinerary even if the email is invalid.
            }
            res.status(200).json(itinerary);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update activity" });
        console.error("Error updating activity:", error);
    }
});

/** Removing an activity */
router.delete("/:itineraryId/activities/:activityId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        } else {
            await itinerary.removeActivity(req.params.activityId);
            res.json(itinerary);
        }
    } catch (error) {
        console.error("Error removing activity:", error);
        res.status(500).json({ error: "Failed to remove activity" });
    }
});

/** Getting all activities */
router.get("/:itineraryId/activities", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        } else {
            res.json(itinerary.activities);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

/** Getting ONE Specific activity */
router.get("/:itineraryId/activities/:activityId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            res.status(403).json({ error: "You do not have permission to access this itinerary" });
            return;
        } else {
            const activity = await findActivityOr404(itinerary, req.params.activityId, res);
            if (!activity) return;
            res.json(activity);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activity" });
    }
});

module.exports = router;