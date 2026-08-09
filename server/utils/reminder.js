import cron from 'node-cron';[cite: 1]
import Subscription from '../models/Subscription.model.js';

const initReminders = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log("Checking subscription renewal reminders...");
            const today = new Date();
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + 3);

            const activeSubs = await Subscription.find({
                status: 'Active',
                renewalDate: { $lte: targetDate, $gte: today }
            }).populate('userId');

            activeSubs.forEach(sub => {
                if (sub.userId) {
                    console.log(`REMINDER: User ${sub.userId.email} - Subscription "${sub.name}" renews soon.`);
                }
            });
        } catch (err) {
            console.error("Reminder cron error:", err);
        }
    });
};

export default initReminders;