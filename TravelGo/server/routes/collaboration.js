/**
 * @file collaboration.js
 * @route /collaboration
 * 
 * This file contains the following routes:
 * 1. GET /accept - Accept an invitation to collaborate on an itinerary using Token
 */

//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// IMPORTING HELPER MODULES
const email = require("../utilities/email-helper");
const { findItineraryOr404, findInvitationOr404 } = require("../utilities/finder-helper");

/** Accepting a collaboration invite */
router.get("/accept", async (req, res) => {
    const { token } = req.query;
    try {
        const invitation = await findInvitationOr404(token, 'Pending', res);
        const itineraryId = invitation.itineraryId;
        if (!invitation) return res.status(404).json({ error: "Invitation not found" });

        const itinerary = await findItineraryOr404(itineraryId, res);
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        itinerary.collaborators.push(invitation.invitee);
        await itinerary.save();

        invitation.status = 'Accepted';
        await invitation.save();

        const inviter = await User.findById(invitation.inviter);
        const invitee = await User.findById(invitation.invitee);

        email.sendCollabAcceptedEmail(inviter.email, inviter.name, invitee.name, itinerary.tripName);

        return res.redirect(
            `${process.env.REACT_APP_API_URL}/collab-accepted?status=success&itineraryName=${encodeURIComponent(itinerary.tripName)}`
        );
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;