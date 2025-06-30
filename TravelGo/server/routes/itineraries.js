/**
 * @file itineraries.js
 * @route /itineraries
 * 
 * This file contains the following routes:
 * 1. POST / - Create a new itinerary
 * 2. GET /get-all-itineraries - Get all itineraries for the authenticated user
 * 3. GET /search-itineraries - Search for itineraries by trip name or destination
 * 4. GET /filter - Filter itineraries by start and end dates
 * 5. GET /:id - Get a specific itinerary
 * 6. PUT /:itineraryId - Update an itinerary by ID
 * 7. DELETE /:itineraryId - Delete an itinerary by ID
 * 
 * 8. POST /:itineraryId/activities - Add an activity
 * 9. PUT /:itineraryId/activities/:activityId - Update an activity by ID
 * 10. DELETE /:itineraryId/activities/:activityId - Remove an activity by ID
 * 11. GET /:itineraryId/activities - Get all activities for an itinerary
 * 12. GET /:itineraryId/activities/:activityId - Get a specific activity by ID
 * 
 * 13. GET /:itineraryId/collaborators - Get all collaborators for an itinerary
 * 14. POST /:itineraryId/invite-collaborator - Invite a collaborator to an itinerary using ID
 * 15. GET /:itineraryId/owner - Get the owner of an itinerary
 */

//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const Itinerary = require("../models/Itineraries");
const Activity = require("../models/Activity");
const User = require("../models/User");
const Invitation = require('../models/Invitation');

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
        const { tripName, destination, startDate, endDate, numberOfPeople, activities, notes } = req.body;
        const userId = req.user._id;

        const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const newItinerary = new Itinerary({
            user: userId,
            tripName,
            destination,
            imageNumber: getRndInteger(1, 20),
            startDate,
            endDate,
            numberOfPeople,
            notes
        });

        // allow activities to be created along with the new itinerary
        if (Array.isArray(activities)) {
            for (const activityData of activities) {
                const newActivity = Activity.newActivity(activityData);
                if (!isValidActivity(newItinerary, newActivity)) {
                    return res.status(400).json({ error: "Invalid activities" });
                }
                await newItinerary.addActivity(newActivity);
            }
        }

        const savedItinerary = await newItinerary.save();
        await savedItinerary.populate('user');
        try {
            email.sendCreateEmail(savedItinerary);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // At this point, we can still return the saved itinerary even if the email is invalid.
            // Previously, we were throwing an error causing the program to crash.
        }
        return res.status(201).json({ savedItinerary, message: "Itinerary added" });
    } catch (error) {
        console.error("Error creating itinerary:", error);
        return res.status(500).json({ error: "Failed to create itinerary" });
    }
});

/** Getting all itineraries */
router.get("/get-all-itineraries", authenticateToken, async (req, res) => {
    const user = req.user;

    try {
        const itinerary = await Itinerary
            .findAccessibleByUser(user._id)
            .sort({ startDate: 1 })
            .select({
                tripName: 1,
                destination: 1,
                imageNumber: 1,
                startDate: 1,
                endDate: 1,
                numberOfPeople: 1
            });
        return res.status(200).json({ itineraries: itinerary });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

/** Search for itineraries */
router.get("/search-itineraries", authenticateToken, async (req, res) => {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query required" })
    }

    try {
        const matchingItinerary = await Itinerary
            .find({
                user: user._id,
                $or: [
                    { tripName: { $regex: new RegExp(query, "i") } },
                    { destination: { $regex: new RegExp(query, "i") } }
                ],
            })
            .sort({ startDate: 1 })
            .select({
                tripName: 1,
                destination: 1,
                imageNumber: 1,
                startDate: 1,
                endDate: 1,
                numberOfPeople: 1
            });
        return res.status(200).json({ itineraries: matchingItinerary });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

/** Filter itineraries */
router.get("/filter", authenticateToken, async (req, res) => {
    const user = req.user;
    const { start, end } = req.query;

    try {
        const matchingItinerary = await Itinerary
            .find({
                user: user._id,
                startDate: { $gte: new Date(start) },
                endDate: { $lte: new Date(end) }
            })
            .sort({ startDate: 1 })
            .select({
                tripName: 1,
                destination: 1,
                imageNumber: 1,
                startDate: 1,
                endDate: 1,
                numberOfPeople: 1
            });
        return res.status(200).json({ itineraries: matchingItinerary });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

/** Getting an itinerary */
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const itinerary = await findItineraryOr404(req.params.id, res);
        if (!itinerary) return;
        return res.status(200).json({ itinerary: itinerary });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Updating an itinerary */
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        } else {
            for (const key in req.body) {
                itinerary[key] = req.body[key];
            }
            await itinerary.save();
            return res.status(200).json({ itinerary, message: "Itinerary updated" });
        }
    } catch (error) {
        console.error("Error updating itinerary:", error);
        return res.status(500).json({ error: "Failed to update itinerary" });
    }
});

/** Removing an itinerary */
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        } else {
            await Itinerary.findByIdAndDelete(req.params.id);
            return res.status(200).json({ itinerary, message: "Itinerary deleted" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete itinerary" });
    }
});

/** Adding an activity to exisitng itinerary */
router.post("/:id/activities", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        }

        const x = Activity.newActivity(req.body);
        if (!isValidActivity(itinerary, x)) {
            return res.status(400).json({ error: "Invalid activity" });
        }
        await itinerary.addActivity(x);
        return res.status(201).json({ itinerary, message: "Activity added" });
    } catch (error) {
        console.error("Error adding activity:", error);
        return res.status(500).json({ error: "Failed to add activity" });
    }
});

/** Updating an activity to exisitng itinerary */
router.put("/:id/activities/:activityId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        } else {
            const activity = await findActivityOr404(itinerary, req.params.activityId, res);
            if (!activity) return;

            const isSame = Object.keys(req.body)
                .every(key => JSON.stringify(activity[key]) === JSON.stringify(req.body[key]));
            if (!isSame) {
                const temp = Activity.newActivity(req.body);
                temp._id = activity._id;
                if (!isValidActivity(itinerary, temp)) {
                    return res.status(400).json({ error: "Invalid activity" });
                }
            }

            await itinerary.updateActivity(activity, req.body);

            function timeToStart(activity, now = new Date()) {
                const [hours, minutes] = activity.startTime.split(':').map(Number);
                const activityStart = new Date(activity.date);
                activityStart.setHours(hours, minutes, 0, 0);

                const diffMs = activityStart - now;
                const diffHours = diffMs / (1000 * 60 * 60);
                return diffHours;
            }

            const duration = timeToStart(activity, new Date()).toFixed(2);
            await itinerary.populate('user');

            try {
                email.sendUpdateEmail(itinerary, activity, Math.floor(duration));
            } catch (emailError) {
                console.error("Error sending email:", emailError);
                // At this point, we can still return the saved itinerary even if the email is invalid.
            }
            return res.status(200).json({ itinerary, message: "Activity updated" });
        }
    } catch (error) {
        console.error("Error updating activity:", error);
        return res.status(500).json({ error: "Failed to update activity" });
    }
});

/** Removing an activity to exisitng itinerary */
router.delete("/:id/activities/:activityId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        } else {
            await itinerary.removeActivity(req.params.activityId);
            return res.json({ itinerary, message: "Activity deleted" });
        }
    } catch (error) {
        console.error("Error removing activity:", error);
        return res.status(500).json({ error: "Failed to delete activity" });
    }
});

/** Getting all activities to exisitng itinerary */
router.get("/:id/activities", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        } else {
            return res.status(200).json(itinerary.activities);
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch activities" });
    }
});

/** Getting ONE Specific activity to exisitng itinerary */
router.get("/:id/activities/:activityId", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.id, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ error: "You do not have permission to access this itinerary" });
        } else {
            const activity = await findActivityOr404(itinerary, req.params.activityId, res);
            if (!activity) return;
            return res.status(200).json(activity);
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch activity" });
    }
});

/** Getting the owner of itinerary */
router.get('/:itineraryId/owner', authenticateToken, async (req, res) => {
    const { itineraryId } = req.params;
    const itinerary = await findItineraryOr404(itineraryId, res);
    if (!itinerary) return res.status(404).json({ error: "Not found" });
    const owner = await itinerary.getOwner();
    res.json({ owner });
});

/** Getting the owner of itinerary */
router.get('/:itineraryId/isOwner', authenticateToken, async (req, res) => {
    const { itineraryId } = req.params;
    const itinerary = await findItineraryOr404(itineraryId, res);
    if (!itinerary) return res.status(404).json({ error: "Not found" });

    const user = req.user;

    console.log(itinerary.user.toString(), user._id.toString());
    const isOwner = itinerary.user.toString() === user._id.toString();
    res.json({ isOwner });
});

/** Getting all existing collaborators */
router.get('/:itineraryId/collaborators', authenticateToken, async (req, res) => {
    const { itineraryId } = req.params;
    const itinerary = await findItineraryOr404(itineraryId, res);
    if (!itinerary) return res.status(404).json({ error: "Not found" });
    const collaborators = await itinerary.getListOfCollaborators();
    res.json({ collaborators });
});

/** Sending a collaboration invite to ONE user */
router.post("/:itineraryId/invite-collaborator", authenticateToken, async (req, res) => {
    
    const user = req.user;
    const { itineraryId } = req.params;

    try {
        const itinerary = await findItineraryOr404(itineraryId, res);

        if (!itinerary) {
            return;
        } else if (!hasAccessToItinerary(itinerary, user)) {
            return res.status(403).json({ success: false, error: "You do not have permission to access this itinerary" });
        } else {
            const { invitedEmail, message } = req.body;
            const invitedUser = await User.findByEmail(invitedEmail);
            if (!invitedUser) return res.status(404).json({ success: false, error: "User not found" });
            const invitingUser = await User.findById(user._id);

            const token = crypto.randomBytes(32).toString('hex');

            if (itinerary.collaborators.some(id => id.toString() === invitedUser._id.toString())) {
                return res.status(400).json({ success: false, error: "User is already a collaborator on this itinerary" });
            }

            const invitation = new Invitation({
                invitedEmail,
                itineraryId: req.params.itineraryId,
                inviter: req.user._id,
                invitee: invitedUser._id,
                token
            });
            await invitation.save();

            email.sendCollabInvitation(invitedEmail, invitingUser.name, invitedUser.name, itinerary.tripName, message, req.params.itineraryId, token);
            return res.status(200).json({ success: true, message: `Invitation sent to ${invitedEmail}` });
        }        
    } catch (error) {
        console.error("Error inviting collaborator:", error);
        return res.status(500).json({ success: false, error: "Failed to invite collaborator" });
    }
});

/** Getting all existing collaborators */
router.post('/:itineraryId/quit', authenticateToken, async (req, res) => {
     try {
        const user = req.user;
        const itinerary = await findItineraryOr404(req.params.itineraryId, res);
        if (!itinerary) {
            return;
        } else {
            console.log("trying to remove collaborator");
            await itinerary.removeCollaborator(user._id);
            console.log("collaborator removed");
            return res.status(200).json({ message: "You have left the itinerary" });
        }
    } catch (error) {
        console.error("Error leaving itinerary:", error);
        return res.status(500).json({ error: "Failed to leave itinerary" });
    }
});

module.exports = router;