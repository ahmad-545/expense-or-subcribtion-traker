import cron from 'node-cron';
import Subscription from '../models/Subscription.model.js';
import { sendDirectWhatsApp } from '../utils/whatsappClient.js'; // Updated path to match filename

const initReminders = () => {
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log("Checking subscription renewal reminders for WhatsApp...");

            const today = new Date();
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + 3);

            const activeSubs = await Subscription.find({
                status: 'Active',
                renewalDate: { $lte: targetDate, $gte: today }
            }).populate('userId');

            for (const sub of activeSubs) {
                if (sub.userId && sub.userId.phone) {
                    const message = `🔔 *ExpenseAI Reminder*\n\nHi ${sub.userId.name},\nYour subscription for *"${sub.name}"* (Rs. ${sub.amount}) is due for renewal on ${new Date(sub.renewalDate).toDateString()}.`;
                    
                    await sendDirectWhatsApp(sub.userId.phone, message);
                }
            }
        } catch (err) {
            console.error("WhatsApp Reminder cron error:", err);
        }
    });
};

export default initReminders;