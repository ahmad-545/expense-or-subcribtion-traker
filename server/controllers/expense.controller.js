import Expense from '../models/Expense.model.js';
import Budget from '../models/Budget.model.js';

export const addExpense = async (req, res) => {
    try {
        const { amount, category, description, date, paymentMethod } = req.body;
        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            category,
            description,
            date,
            paymentMethod
        });

        const budget = await Budget.findOne({ userId: req.user.id, category });
        let alertMessage = null;

        if (budget) {
            const totalSpentResult = await Expense.aggregate([
                { $match: { userId: expense.userId, category } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            
            const totalSpent = totalSpentResult[0] ? totalSpentResult[0].total : 0;

            if (totalSpent > budget.monthlyLimit) {
                alertMessage = `Red Alert: ${category} budget exceeded! Limit was Rs. ${budget.monthlyLimit}, but total spent is Rs. ${totalSpent}.`;
            }
        }

        res.status(201).json({ expense, alert: alertMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};