import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ['Food', 'Grocery', 'Rent', 'Bills', 'Petrol', 'Shopping', 'Entertainment', 'Travel', 'Education', 'Medical', 'Other'], 
        required: true 
    },
    description: { type: String },
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: 'Cash' }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);