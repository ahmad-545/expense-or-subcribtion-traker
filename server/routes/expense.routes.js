import express from 'express';
import { addExpense, getExpenses } from '../controllers/expense.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', verifyToken, addExpense);
router.get('/', verifyToken, getExpenses);

export default router;