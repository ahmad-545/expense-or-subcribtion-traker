import express from 'express';
import { setBudget, getBudgets, deleteBudget } from '../controllers/budget.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', verifyToken, setBudget);
router.get('/', verifyToken, getBudgets);
router.delete('/:id', verifyToken, deleteBudget);

export default router;