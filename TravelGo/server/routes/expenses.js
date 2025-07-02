/**
 * @file expenses.js
 * @route /expenses
 * 
 * This file contains the following routes:
 * 1. POST /:itineraryId/ - add expenses
 * 2. PUT /:itineraryId/:expensesId - update expenses
 * 3. GET /:itineraryId/recent-expenses - get recent added expenses (show latest 4)
 * 4. GET /:itineraryId/weekly-overview - get weekly transaction overview (show latest 7)
 * 5. GET /:itineraryId/latest-expenses - get latest expenditure (show latest 8)
 * 6. GET /:itineraryId/all-expenses - get all expenditure
 * 7. DELETE /:itineraryId/:expensesId - delete expenses
 */

const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Expenses = require("../models/Expenses");

const { findExpensesOr404 } = require("../utilities/finder-helper");

/** Add an expenses */
router.post('/:itineraryId/', authenticateToken, async (req, res) => {
    try {
        const { title, date, amount, type, whoPaid, notes } = req.body;

        const newExpenses = new Expenses({
            itineraryId: req.params.itineraryId,
            title,
            date,
            amount,
            type,
            whoPaid,
            notes
        });
        await (await newExpenses.save()).populate('itineraryId');
        return res.status(200).json({ newExpenses, message: "Expenses added" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Edit an expenses */
router.put('/:itineraryId/:expensesId', authenticateToken, async (req, res) => {
    try {
        const expenses = await findExpensesOr404(req.params.expensesId, res);
        if (!expenses) {
            return;
        } else {
            for (const key in req.body) {
                expenses[key] = req.body[key];
            }
            await expenses.save();
            return res.status(200).json({ message: "Expenses updated" });
        }
    } catch (error) {
        return ers.status(500).json({ error: error.message });
    }
});

/** Get recent added expenses */
router.get('/:itineraryId/recent-expenses', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const recentTransaction = await Expenses
            .find({ itineraryId })
            .sort({ createdAt: -1 })
            .limit(4);
        return res.status(200).json({ recentTransaction });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Get weekly transaction */
router.get('/:itineraryId/weekly-overview', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const weeklyOverview = await Expenses.aggregate([
            { $match: { itineraryId } },
            {
                $group: {
                    _id: {
                        year: { $isoWeekYear: "$date" },
                        week: { $isoWeek: "$date" },
                    },
                    transactions: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            date: "$date",
                            amount: "$amount",
                            type: "$type",
                            whoPaid: "$whoPaid",
                            notes: "$notes"
                        }
                    }
                }
            },
            { $sort: { "_id.year": -1, "_id.week": -1 } }
        ]);
        return res.status(200).json({ weeklyOverview });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Get 8 latest expenses */
router.get('/:itineraryId/latest-expenses', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const latestExpneses = await Expenses
            .find({ itineraryId })
            .sort({ date: -1, createdAt: -1 })
            .limit(8);
        return res.status(200).json({ latestExpneses });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Get all expenses */
router.get('/:itineraryId/all-expenses', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const allExpenses = await Expenses
            .find({ itineraryId })
            .sort({ date: -1, createdAt: -1 });
        return res.status(200).json({ allExpenses });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Delete an expenses */
router.delete('/:itineraryId/:expensesId', authenticateToken, async (req, res) => {
    try {
        await Expenses.findByIdAndDelete(req.params.expensesId);
        return res.status(200).json({ message: "Expenses deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

module.exports = router;