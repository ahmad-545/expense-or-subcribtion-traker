import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false }, // Naya field: User ka WhatsApp number
    monthlyIncome: { type: Number, default: 0 },
    savingGoal: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);