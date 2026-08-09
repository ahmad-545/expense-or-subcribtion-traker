import Subscription from '../models/Subscription.model.js';

export const addSubscription = async (req, res) => {
    try {
        const { name, amount, renewalDate, billingCycle, paymentMethod, autoRenew } = req.body;
        const subscription = await Subscription.create({
            userId: req.user.id,
            name,
            amount,
            renewalDate,
            billingCycle,
            paymentMethod,
            autoRenew
        });
        res.status(201).json(subscription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user.id });
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};