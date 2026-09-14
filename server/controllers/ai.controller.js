import Groq from 'groq-sdk';
import Expense from '../models/Expense.model.js';
import Subscription from '../models/Subscription.model.js';
import User from '../models/User.model.js';
import Budget from '../models/Budget.model.js';

export const getAIAdvisorReport = async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, error: "Groq API Key is missing in environment variables." });
        }

        const groq = new Groq({ apiKey });

        const userId = req.user?.id;
        const { userQuery, chatHistory } = req.body;

        const [user, expenses, subscriptions, budgets] = await Promise.all([
            User.findById(userId).catch(() => null),
            Expense.find({ userId }).catch(() => []),
            Subscription.find({ userId }).catch(() => []),
            Budget.find({ userId }).catch(() => [])
        ]);

        const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
        const totalSubCost = subscriptions.reduce((sum, s) => sum + Number(s.amount || 0), 0);

        // Group expenses by category
        const categoryMap = {};
        expenses.forEach(e => {
            const cat = e.category || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
        });

        const categoryBreakdown = Object.entries(categoryMap)
            .map(([cat, amt]) => `- ${cat}: Rs. ${amt}`)
            .join('\n');

        const budgetComparison = budgets.map(b => {
            const spent = categoryMap[b.category] || 0;
            const status = spent > b.monthlyLimit ? `⚠️ OVER BUDGET by Rs. ${spent - b.monthlyLimit}` : `✅ Within limit (Rs. ${spent} / Rs. ${b.monthlyLimit})`;
            return `- ${b.category}: Limit Rs. ${b.monthlyLimit} -> ${status}`;
        }).join('\n');

        const recentExpenses = expenses.slice(-10).map(e => 
            `- ${e.category}: Rs. ${e.amount} on ${e.date ? new Date(e.date).toLocaleDateString() : 'N/A'} (${e.description || 'No desc'})`
        ).join('\n');

        const subSummary = subscriptions.map(s => 
            `- ${s.name}: Rs. ${s.amount} (${s.billingCycle || 'Monthly'})`
        ).join('\n');

        const systemPrompt = `
You are ExpenseAI's intelligent, empathetic, and expert Personal Financial Advisor.

USER FINANCIAL SNAPSHOT:
- User Name: ${user?.name || 'Valued User'}
- Monthly Income: Rs. ${user?.monthlyIncome || 0}
- Saving Goal: Rs. ${user?.savingGoal || 0}
- Total Expenses Logged: Rs. ${totalExpenses}
- Total Recurring Subscriptions: Rs. ${totalSubCost} / period

CATEGORY SPENDING BREAKDOWN:
${categoryBreakdown || 'No expenses recorded yet.'}

BUDGET LIMITS & STATUS:
${budgetComparison || 'No category budgets configured yet.'}

RECENT TRANSACTIONS:
${recentExpenses || 'None'}

ACTIVE SUBSCRIPTIONS:
${subSummary || 'No active subscriptions.'}

CORE GUIDELINES:
1. **Financial Focus:** Answer strictly regarding personal finances, budgeting, cost-cutting, savings, investing awareness, and expense tracking. Politely decline unrelated topics.
2. **Language Matching (Strict):**
   - If user asks in **Roman Urdu/Hindi** (e.g. "Mera budget kaisa chal raha hai?"), reply in natural, friendly **Roman Urdu**.
   - If user asks in **Urdu Script** (اردو), reply in **Urdu script**.
   - If user asks in **English**, reply in professional, clear **English**.
3. **Format & Tone:** Use clear bullet points, bold key figures (Rs.), use friendly emojis (💡, 📊, ⚠️, 🎯), and keep insights crisp, concise, and immediately actionable. Avoid overwhelming walls of text.
`;

        // Build message payload
        const messages = [{ role: "system", content: systemPrompt }];

        // Append recent chat history if provided
        if (Array.isArray(chatHistory)) {
            const validHistory = chatHistory.slice(-6).filter(m => m.role && m.content);
            messages.push(...validHistory);
        }

        // Append current user message
        const currentQuery = userQuery?.trim() || "Please give me a complete financial health report and smart money-saving recommendations.";
        messages.push({ role: "user", content: currentQuery });

        let advice = "";
        try {
            const completion = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 1024,
            });
            advice = completion.choices[0]?.message?.content || "Could not generate advice.";
        } catch (groqErr) {
            console.warn("Retrying with llama-3.1-8b-instant due to:", groqErr.message);
            const fallback = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.1-8b-instant",
                temperature: 0.7,
                max_tokens: 1024,
            });
            advice = fallback.choices[0]?.message?.content || "Could not generate advice.";
        }

        res.json({ success: true, advice });

    } catch (err) {
        console.error("Groq AI Error Details:", err);
        res.status(500).json({ success: false, error: err.message || "Internal server error in AI advisor" });
    }
};