import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bank: { type: String, required: true },
    cardType: { type: String, required: true },
    lastFourDigits: { type: String, required: true, maxLength: 4 },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Card', cardSchema);