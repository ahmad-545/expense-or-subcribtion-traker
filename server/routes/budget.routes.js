import express from 'express';
import { setBudget, getBudgets } from '../controllers/budget.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', verifyToken, setBudget);
router.get('/', verifyToken, getBudgets);

export default router;