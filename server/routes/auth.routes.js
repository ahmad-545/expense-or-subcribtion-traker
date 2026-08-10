import express from 'express';
import { register, login, logout,updateProfile } from '../controllers/auth.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.put('/update-profile', verifyToken, updateProfile);

export default router;