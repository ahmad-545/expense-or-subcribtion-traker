import express from 'express';
import { getAIAdvisorReport } from '../controllers/ai.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Yahan .post hona chahiye, .get nahi!
router.post('/report', verifyToken, getAIAdvisorReport);

export default router;