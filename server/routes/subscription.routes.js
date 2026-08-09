import express from 'express';
import { addSubscription, getSubscriptions } from '../controllers/subscription.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', verifyToken, addSubscription);
router.get('/', verifyToken, getSubscriptions);

export default router;