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
import { sendDirectWhatsApp as sendWhatsAppMessage } from './utils/whatsappClient.js'

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});