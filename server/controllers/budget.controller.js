import Budget from '../models/Budget.model.js';

export const setBudget = async (req, res) => {
    try {
        const { category, monthlyLimit } = req.body;
        const budget = await Budget.findOneAndUpdate(
            { userId: req.user.id, category },
            { monthlyLimit },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, budget });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteBudget = async (req, res) => {
    try {
        await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ success: true, message: "Budget deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};