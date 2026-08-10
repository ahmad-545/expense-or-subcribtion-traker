import Subscription from '../models/Subscription.model.js';
import User from '../models/User.model.js';
import client from '../utils/whatsappClient.js';

export const addSubscription = async (req, res) => {
    try {
        const { name, amount, renewalDate, billingCycle, paymentMethod, autoRenew } = req.body;
        const userId = req.user.id;

        // 1. User ki monthly income check karne ke liye profile fetch karein
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check karein ke subscription amount monthly income se zyada hai ya nahi
        if (Number(amount) > user.monthlyIncome) {
            if (client && user.phone) {
                try {
                    const cleanPhone = user.phone.replace(/[^0-9]/g, '');
                    const formattedPhone = `${cleanPhone}@c.us`;
                    
                    const alertMessage = `🚨 *SUBSCRIPTION LIMIT ALERT!*\n\nHi ${user.name},\nYour new subscription for *${name}* (Rs. ${amount}) exceeds your monthly income (*Rs. ${user.monthlyIncome}*).\n\nPlease review your financial goals!`;
                    
                    await client.sendMessage(formattedPhone, alertMessage);
                } catch (waErr) {
                    console.error("WhatsApp message failed to send:", waErr);
                }
            }

            return res.status(400).json({ 
                success: false,
                warning: true, 
                message: `Warning! Yeh subscription (Rs. ${amount}) aapki monthly income (Rs. ${user.monthlyIncome}) se zyada hai! WhatsApp par alert bhej diya gaya hai.` 
            });
        }

        // 3. Normal Subscription Create Karein
        const subscription = await Subscription.create({
            userId,
            name,
            amount,
            renewalDate,
            billingCycle,
            paymentMethod,
            autoRenew
        });

        res.status(201).json({ success: true, subscription });
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