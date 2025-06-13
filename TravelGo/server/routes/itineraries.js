/** itineraries.js
 * This file contains the Express routes for managing itineraries and activities.
 * CREATE, DELETE and UDPATE itineraries and activities.
 */

//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itineraries");

const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require('node.fs');

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
        const { destination, startDate, endDate, numberOfPeople, notes } = req.body;
        const userId = req.user._id;
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: `A beautiful travel photo of ${destination}`,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });
        const mimeType = response.candidates[0].content.parts[1].inlineData.mimeType;
        const base64Data = response.candidates[0].content.parts[1].inlineData.data;
        const image = `data:${mimeType};base64,${base64Data}`;

        const newItinerary = new Itinerary({
            user: userId,
            destination,
            imageUrl: image,
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