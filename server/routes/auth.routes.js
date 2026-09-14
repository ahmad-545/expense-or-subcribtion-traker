import express from 'express';
import { register, login, logout, updateProfile, forgotPassword, resetPassword, changePassword } from '../controllers/auth.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.put('/update-profile', verifyToken, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', verifyToken, changePassword);

export default router;