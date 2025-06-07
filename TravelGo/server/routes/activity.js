//Express routes for itineraries CRUD (Create, Read, Update, and Delete)
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

router.post("/", async (req, res) => {
    try {
        const activity = new Activity(req.body);
        const savedActivity = await activity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        res.status(500).json({ error: "Failed to create activity" });
    }
});

router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ error: "Activity not found" });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activity" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedActivity) return res.status(404).json({ error: "Activity not found" });
        res.json(updatedActivity);
    } catch (error) {
        res.status(500).json({ error: "Failed to update activity" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
        if (!deletedActivity) return res.status(404).json({ error: "Activity not found" });
        res.json({ message: "Activity deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete activity" });
    }
});

module.exports = router;