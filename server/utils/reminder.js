import cron from 'node-cron';
import Subscription from '../models/Subscription.model.js';
import { sendEmail } from '../utils/sendEmail.js';

const initReminders = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log("Checking subscription renewal reminders for Email...");

            const today = new Date();
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + 3);

            const activeSubs = await Subscription.find({
                status: 'Active',
                renewalDate: { $lte: targetDate, $gte: today }
            }).populate('userId');

            for (const sub of activeSubs) {
                if (sub.userId && sub.userId.email) {
                    const subject = "🔔 Subscription Renewal Reminder";
                    const message = `Hi ${sub.userId.name},\n\nYour subscription for "${sub.name}" (Rs. ${sub.amount}) is due for renewal on ${new Date(sub.renewalDate).toDateString()}.\n\nPlease review your account!`;
                    
                    await sendEmail(sub.userId.email, subject, message);
                }
            }
        } catch (err) {
            console.error("Email Reminder cron error:", err);
        }
    });
};

export default initReminders;