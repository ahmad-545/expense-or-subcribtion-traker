import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, monthlyIncome, savingGoal } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            monthlyIncome: Number(monthlyIncome) || 0, 
            savingGoal: Number(savingGoal) || 0 
        });

        res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // Response mein monthlyIncome aur savingGoal bhi return kar diye hain taake frontend par dashboard mein foran show hon
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                monthlyIncome: user.monthlyIncome, 
                savingGoal: user.savingGoal 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { monthlyIncome, savingGoal, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { monthlyIncome: Number(monthlyIncome) || 0, savingGoal: Number(savingGoal) || 0, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: { 
                id: updatedUser._id, 
                name: updatedUser.name, 
                email: updatedUser.email, 
                monthlyIncome: updatedUser.monthlyIncome,
                savingGoal: updatedUser.savingGoal 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found with this email" });

        // 1 ghante ke liye valid random token generate karo
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        // Frontend reset link (deployed ya local dono ke liye)
        const clientURL = process.env.CLIENT_URL || 'https://expense-or-subcribtion-traker-jw8j.vercel.app';
        const resetLink = `${clientURL}/reset-password/${resetToken}`;

        const subject = '🔒 ExpenseAI - Password Reset Request';
        const text = `Hello ${user.name},\n\nYou requested to reset your password.\n\nClick the link below to set a new password (valid for 1 hour):\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nRegards,\nExpenseAI Team`;
        const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #030814; color: #fff; padding: 40px 20px; min-height: 100vh;">
          <div style="max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 28px; font-weight: 800; color: #fff; margin: 0;">
                Expense<span style="color: #10b981;">AI.</span>
              </h1>
            </div>
            <h2 style="font-size: 20px; font-weight: 700; color: #f1f5f9; margin-bottom: 12px;">Password Reset Request</h2>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 8px;">Hi <strong style="color: #e2e8f0;">${user.name}</strong>,</p>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">We received a request to reset your ExpenseAI password. Click the button below to choose a new password. This link is valid for <strong style="color: #10b981;">1 hour</strong>.</p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${resetLink}" style="display: inline-block; background: #10b981; color: #fff; font-weight: 700; font-size: 16px; text-decoration: none; padding: 14px 36px; border-radius: 16px; box-shadow: 0 4px 20px rgba(16,185,129,0.3);">
                Reset My Password
              </a>
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin-bottom: 8px;">Or copy and paste this link into your browser:</p>
            <p style="color: #10b981; font-size: 12px; word-break: break-all; background: #1e293b; padding: 12px 16px; border-radius: 10px; margin-bottom: 32px;">${resetLink}</p>
            <hr style="border: none; border-top: 1px solid #1e293b; margin-bottom: 24px;" />
            <p style="color: #475569; font-size: 13px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
            <p style="color: #475569; font-size: 13px; margin-top: 16px;">— The <span style="color: #10b981;">ExpenseAI</span> Team</p>
          </div>
        </div>`;

        await sendEmail(user.email, subject, text, html);

        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Token ko hash karke DB se match karo
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } // abhi bhi valid hai?
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token. Please request again." });
        }

        // Naya password set karo
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Auto-login ke liye token generate karo
        const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ 
            message: "Password reset successfully!",
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                monthlyIncome: user.monthlyIncome,
                savingGoal: user.savingGoal
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};