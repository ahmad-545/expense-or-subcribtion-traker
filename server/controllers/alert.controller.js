import Subscription from '../models/Subscription.model.js';

export const getAlerts = async (req, res) => {
    try {
        const today = new Date();
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + 3);

        const upcomingSubs = await Subscription.find({
            userId: req.user.id,
            status: 'Active',
            renewalDate: { $lte: targetDate, $gte: today }
        });

        const alerts = upcomingSubs.map(sub => {
            return {
                id: sub._id,
                message: `Reminder: Your subscription for "${sub.name}" (Rs. ${sub.amount}) is due for renewal on ${sub.renewalDate.toDateString()}.`
            };
        });

        res.json({ alerts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};