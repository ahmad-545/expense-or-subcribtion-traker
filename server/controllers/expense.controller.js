import Expense from '../models/Expense.model.js';
import User from '../models/User.model.js'; 
import client from '../utils/whatsappClient.js'; 

export const addExpense = async (req, res) => {
    try {
        const { amount, category, description, date, paymentMethod } = req.body;
        const userId = req.user.id;

        // 1. User ki profile find karein
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Abhi tak ke saare expenses ka sum nikalrein
        const existingExpenses = await Expense.find({ userId });
        const totalSpentSoFar = existingExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

        // 3. Naya expense add hone ke baad total spending kitni banegi
        const newTotalSpent = totalSpentSoFar + Number(amount);

        let alertMessage = null;

        // 4. Check karein ke total spending monthly income se zyada ho rahi hai ya nahi
        if (newTotalSpent > user.monthlyIncome) {
            alertMessage = `Warning! Yeh expense milane se aapka total spend (Rs. ${newTotalSpent}) monthly income (Rs. ${user.monthlyIncome}) se barh gaya hai!`;

            // WhatsApp par alert bhejne ka code
            if (client && user.phone) {
                try {
                    const cleanPhone = user.phone.replace(/[^0-9]/g, ''); 
                    const formattedPhone = `${cleanPhone}@c.us`;
                    
                    const waMessage = `🚨 *BUDGET LIMIT EXCEEDED!*\n\nHi ${user.name},\nYour total expenses (*Rs. ${newTotalSpent}*) have crossed your monthly income (*Rs. ${user.monthlyIncome}*).\n\nPlease review your spending!`;
                    
                    await client.sendMessage(formattedPhone, waMessage);
                } catch (waErr) {
                    console.error("WhatsApp message failed to send:", waErr);
                }
            }
        }

        // 5. Expense ko lazmi save karein (chahe limit exceed hui ho ya nahi)
        const expense = await Expense.create({
            userId,
            amount,
            category,
            description,
            date,
            paymentMethod
        });

        // 6. Response bhein jisme expense bhi ho aur alert message bhi agar ho
        res.status(201).json({ 
            success: true, 
            expense, 
            alert: alertMessage 
        });
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

// DELETE Expense
export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Expense
export const updateExpense = async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json({ success: true, expense: updatedExpense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};