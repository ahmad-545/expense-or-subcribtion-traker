import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    renewalDate: { type: Date, required: true },
    billingCycle: { type: String, enum: ['Monthly', 'Yearly'], default: 'Monthly' },
    paymentMethod: { type: String, required: true },
    autoRenew: { type: Boolean, default: true },
    status: { type: String, enum: ['Active', 'Cancelled'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);