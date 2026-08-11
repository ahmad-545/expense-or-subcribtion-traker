import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import initReminders from './utils/reminder.js';

import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import cardRoutes from './routes/card.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import alertRoutes from './routes/alert.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();
initReminders();

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);

// Root test route taake browser mein URL kholne par error na aaye
app.get('/', (req, res) => {
    res.send('Backend is running successfully on Vercel!');
});

const PORT = process.env.PORT || 8000;

// Local development ke liye app.listen
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Vercel serverless deployment ke liye export karna zaroori hai
export default app;