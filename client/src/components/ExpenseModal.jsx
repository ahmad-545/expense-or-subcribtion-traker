import { useState, useEffect } from 'react';
import API from '../services/api';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const categories = [
    'Food', 'Grocery', 'Rent', 'Bills', 'Petrol', 
    'Shopping', 'Entertainment', 'Travel', 'Education', 'Medical', 'Other'
];

export default function ExpenseModal({ isOpen, onClose, onExpenseAdded, expenseToEdit }) {
    const isEditMode = !!expenseToEdit;

    const getFormattedDate = (dateVal) => {
        if (!dateVal) return new Date().toISOString().split('T')[0];
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
        return d.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        description: '',
        paymentMethod: 'Cash',
        date: getFormattedDate(new Date())
    });
    
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    useEffect(() => {
        if (expenseToEdit) {
            setFormData({
                amount: expenseToEdit.amount || '',
                category: expenseToEdit.category || 'Food',
                description: expenseToEdit.description || '',
                paymentMethod: expenseToEdit.paymentMethod || 'Cash',
                date: getFormattedDate(expenseToEdit.date)
            });
        } else {
            setFormData({
                amount: '',
                category: 'Food',
                description: '',
                paymentMethod: 'Cash',
                date: getFormattedDate(new Date())
            });
        }
        setAlertMsg('');
    }, [expenseToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlertMsg('');
        try {
            let res;
            if (isEditMode) {
                res = await API.put(`/expenses/${expenseToEdit._id}`, formData);
                toast.success("Expense updated successfully!", { position: "top-right", autoClose: 3000 });
            } else {
                res = await API.post('/expenses', formData);
                
                if (res.data.alert) {
                    setAlertMsg(res.data.alert);
                    toast.warning(res.data.alert, { position: "top-right", autoClose: 5000 });
                    
                    const existingNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
                    const newNotif = {
                        id: Date.now(),
                        title: 'Budget Limit Exceeded!',
                        desc: res.data.alert,
                        type: 'warning',
                        time: 'Just now'
                    };
                    localStorage.setItem('app_notifications', JSON.stringify([newNotif, ...existingNotifs]));
                    window.dispatchEvent(new Event('storage_updated'));
                } else {
                    toast.success("Expense added successfully!", { position: "top-right", autoClose: 3000 });
                }
            }

            setTimeout(() => {
                onExpenseAdded();
                onClose();
            }, res.data?.alert && !isEditMode ? 4000 : 500);

        } catch (err) {
            console.error("Error saving expense", err);
            toast.error(err.response?.data?.message || "Failed to save expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={20} />
                </button>
                <h3 className="text-xl font-bold text-white mb-4">
                    {isEditMode ? 'Edit Expense' : 'Add New Expense'}
                </h3>

                {alertMsg && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm mb-4">
                        {alertMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Amount (Rs.)</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500" />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500">
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm mb-1">Description / Notes</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g. Lunch with friends" className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-300 text-sm mb-1">Payment Method</label>
                            <input type="text" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} placeholder="Cash / HBL Card" className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500" />
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm mb-1">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition duration-200">
                        {loading ? 'Saving...' : (isEditMode ? 'Update Expense' : 'Add Expense')}
                    </button>
                </form>
            </div>
        </div>
    );
}