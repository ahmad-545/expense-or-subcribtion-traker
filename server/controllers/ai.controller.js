import Groq from 'groq-sdk';
import Expense from '../models/Expense.model.js';
import Subscription from '../models/Subscription.model.js';
import User from '../models/User.model.js';

export const getAIAdvisorReport = async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, error: "Groq API Key is missing in environment variables." });
        }

        const groq = new Groq({ apiKey });

        const userId = req.user?.id;
        const { userQuery } = req.body;

        const user = await User.findById(userId).catch(() => null);
        const expenses = await Expense.find({ userId }).catch(() => []);
        const subscriptions = await Subscription.find({ userId }).catch(() => []);

        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
        
        const expenseSummary = expenses.map(e => `- ${e.category || 'Other'}: Rs. ${e.amount || 0} (${e.description || 'No desc'}, ${e.date || 'N/A'})`).join('\n');
        const subSummary = subscriptions.map(s => `- ${s.name || 'Sub'}: Rs. ${s.amount || 0} (${s.billingCycle || 'Monthly'})`).join('\n');

        const systemPrompt = `
            You are an expert AI Financial Advisor for an Expense and Subscription Tracker app.
            
            USER DATA:
            - Name: ${user?.name || 'User'}
            - Monthly Income: Rs. ${user?.monthlyIncome || 0}
            - Total Spent So Far: Rs. ${totalExpenses}
            - Expenses:
            ${expenseSummary || 'No expenses recorded.'}
            - Subscriptions:
            ${subSummary || 'No subscriptions recorded.'}

            RULES & INSTRUCTIONS:
            1. **Strict Focus:** You must ONLY answer questions or provide advice related to this user's personal expenses, budgets, savings, subscriptions, and financial health.
            2. **Irrelevant Questions:** If the user asks anything irrelevant, politely decline to answer in the same language they spoke.
            3. **Language Matching (Mandatory):** Detect the language/script of the user's query. If the user writes in Urdu script (اردو), reply strictly in Urdu script. If the user writes in Roman Urdu/Hindi (e.g., "Mera kharcha kitna hai?"), reply strictly in Roman Urdu. If the user writes in English, reply strictly in English. 
            4. **Actionable Insights:** Give smart tips, like pointing out high spending categories or unused subscriptions.
        `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery || "Please give me a complete financial health report and analysis of my expenses." }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
        });

        const advice = completion.choices[0]?.message?.content || "Could not generate advice.";

        res.json({ success: true, advice });

    } catch (err) {
        console.error("Groq AI Error Details:", err);
        res.status(500).json({ success: false, error: err.message || "Internal server error in AI advisor" });
    }
};