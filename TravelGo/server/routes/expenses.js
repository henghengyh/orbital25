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
 * 7. GET /:itineraryId/expenses-breakdown - get breakdown of expenses
 * 8. GET /:itineraryId/split-expenses - get expenses split by who paid
 * 9. GET /:itineraryId/:expensesId - get an expenses
 * 10. DELETE /:itineraryId/:expensesId - delete expenses
 */

const authenticateToken = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Expenses = require("../models/Expenses");

const { findExpensesOr404 } = require("../utilities/finder-helper");
const typesOfExpenses = ["accommodation", "activities", "food", "gift", "others", "shopping", "transport"];

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
            let oldAmt = expenses.amount;
            let newAmt = 0;
            for (const key in req.body) {
                if (key === "amount") newAmt = req.body[key];
                expenses[key] = req.body[key];
            }
            await expenses.save();
            return res.status(200).json({ message: "Expenses updated", amount: newAmt - oldAmt });
        }
    } catch (error) {
        return ers.status(500).json({ error: error.message });
    }
});

/** Get recent added expenses */
router.get('/:itineraryId/recent-expenses', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const recentExpenses = await Expenses
            .find({ itineraryId })
            .sort({ createdAt: -1 })
            .limit(4);
        return res.status(200).json({ recentExpenses });
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
                            date: "$date",
                            amount: "$amount",
                            type: "$type",
                        }
                    }
                }
            },
            { $sort: { "_id.year": -1, "_id.week": -1 } },
            { $limit: 1 },
        ]);

        if (weeklyOverview.length <= 0) return res.status(200).json({ weeklyOverview });

        // get ISO week which starts on a Monday
        const getISOWeekStartDate = (isoYear, isoWeek) => {
            const jan4 = new Date(Date.UTC(isoYear, 0, 4)); // Jan 4 is always in ISO week 1
            const jan4Day = jan4.getUTCDay() || 7; // Make Sunday = 7
            const mondayOfWeek1 = new Date(jan4);
            mondayOfWeek1.setUTCDate(jan4.getUTCDate() - jan4Day + 1);

            const resultDate = new Date(mondayOfWeek1);
            resultDate.setUTCDate(mondayOfWeek1.getUTCDate() + (isoWeek - 1) * 7);
            return resultDate;
        }

        const { year, week } = weeklyOverview[0]._id;
        const startOfWeek = getISOWeekStartDate(year, week);

        //initialise all expenses of the week to 0
        const days = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isoDate = date.toISOString().split("T")[0];

            const dayData = { date: isoDate };
            typesOfExpenses.forEach(type => (dayData[type] = 0));
            return dayData;
        });

        // tabulate all expenses for each day in the week
        weeklyOverview[0].transactions.forEach(tx => {
            const txDate = new Date(tx.date).toISOString().split("T")[0];
            const matchingDay = days.find(d => d.date === txDate);
            if (!matchingDay) return;

            const type = typesOfExpenses.includes(tx.type) ? tx.type : "others";
            matchingDay[type] += tx.amount;
        });
        return res.status(200).json({ weeklyOverview: days });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Get 8 latest expenses */
router.get('/:itineraryId/latest-expenses', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const latestExpenses = await Expenses
            .find({ itineraryId })
            .sort({ date: -1, createdAt: -1 })
            .limit(8);
        return res.status(200).json({ latestExpenses });
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

/** Get breakdown of expenses */
router.get('/:itineraryId/expenses-breakdown', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const expensesBreakdown = await Expenses.aggregate([
            { $match: { itineraryId } },
            {
                $group: {
                    _id: {
                        type: "$type",
                    },
                    totalAmount: { $sum: "$amount" },
                }
            },
            {
                $project: {
                    type: "$_id.type",
                    totalAmount: 1,
                    _id: 0
                }
            },
            { $sort: { "type": -1 } }
        ]);
        return res.status(200).json({ expensesBreakdown });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Get expenses split by who paid */
router.get('/:itineraryId/split-expenses', authenticateToken, async (req, res) => {
    try {
        const itineraryId = new mongoose.Types.ObjectId(req.params.itineraryId);

        const splitExpenses = await Expenses.aggregate([
            { $match: { itineraryId } },
            {
                $group: {
                    _id: { $trim: { input: { $toLower: "$whoPaid" } } },
                    totalAmount: { $sum: "$amount" },
                }
            },
            {
                $project: {
                    whoPaid: "$_id",
                    totalAmount: 1,
                    _id: 0
                }
            },
            { $sort: { "whoPaid": 1 } },
        ]);

        const reorderSplit = (splitExpenses) => {
            if (!splitExpenses || splitExpenses.length <= 0) return [];

            const totalExpenses = splitExpenses.reduce((total, curr) => curr.totalAmount + total, 0);
            const costPerPerson = totalExpenses / splitExpenses.length;
            const balance = splitExpenses.map(e => ({ name: e.whoPaid, netBalance: e.totalAmount - costPerPerson }));

            let creditors = balance.filter(e => e.netBalance > 0).sort((a, b) => b.netBalance - a.netBalance);
            let debtors = balance.filter(e => e.netBalance < 0).sort((a, b) => b.netBalance - a.netBalance);

            const settlement = [];
            let credIdx = 0;
            let debtIdx = 0;
            while (credIdx < creditors.length && debtIdx < debtors.length) {
                const creditor = creditors[credIdx];
                const debtor = debtors[debtIdx];
                const amt = Math.min(creditor.netBalance, Math.abs(debtor.netBalance));

                settlement.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: amt,
                })

                creditor.netBalance = creditor.netBalance - amt;
                debtor.netBalance = debtor.netBalance + amt;

                if (creditor.netBalance < 0.01) credIdx++;
                if (Math.abs(debtor.netBalance) < 0.01) debtIdx++;
            }
            return settlement.sort((a, b) => b.amount - a.amount);
        };
        return res.status(200).json({ splitExpenses: { splitExpenses: splitExpenses, settlement: reorderSplit(splitExpenses) } });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Get an expenses */
router.get('/:itineraryId/:expensesId', authenticateToken, async (req, res) => {
    try {
        const expenses = await findExpensesOr404(req.params.expensesId, res);
        if (!expenses) return;
        return res.status(200).json({ expenses });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/** Delete an expenses */
router.delete('/:itineraryId/:expensesId', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expenses.findByIdAndDelete(req.params.expensesId);
        return res.status(200).json({ message: "Expenses deleted", amount: expenses.amount });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

module.exports = router;