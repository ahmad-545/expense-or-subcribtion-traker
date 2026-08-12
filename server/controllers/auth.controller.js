import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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