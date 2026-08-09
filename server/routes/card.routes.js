import express from 'express';
import { addCard, getCards } from '../controllers/card.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', verifyToken, addCard);
router.get('/', verifyToken, getCards);

export default router;