import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Target, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const categories = [
    'Food', 'Grocery', 'Rent', 'Bills', 'Petrol', 
    'Shopping', 'Entertainment', 'Travel', 'Education', 'Medical', 'Other'
];

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [category, setCategory] = useState('Food');
    const [monthlyLimit, setMonthlyLimit] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const { data } = await API.get('/budgets');
            setBudgets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching budgets", err);
            setBudgets([]);
        }
    };

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        if (!monthlyLimit) return;
        setLoading(true);
        try {
            await API.post('/budgets', { category, monthlyLimit: Number(monthlyLimit) });
            toast.success("Budget saved successfully!");
            setMonthlyLimit('');
            fetchBudgets();
        } catch (err) {
            console.error("Error saving budget", err);
            toast.error("Failed to save budget");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget limit?")) {
            try {
                await API.delete(`/budgets/${id}`);
                toast.success("Budget deleted successfully!");
                fetchBudgets();
            } catch (err) {
                console.error("Error deleting budget", err);
                toast.error("Failed to delete budget");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Category Budgets</h1>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Set monthly spending limits for each category to manage your money wisely.</p>
                    </div>

                    {/* Set Budget Form */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl max-w-xl">
                        <h3 className="text-base font-bold text-white mb-4">Set / Update Budget Limit</h3>
                        <form onSubmit={handleSaveBudget} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Category</label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500 text-sm"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm mb-1">Monthly Limit (Rs.)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 15000" 
                                    value={monthlyLimit} 
                                    onChange={(e) => setMonthlyLimit(e.target.value)} 
                                    required 
                                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500 text-sm" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> {loading ? 'Saving...' : 'Save Budget Limit'}
                            </button>
                        </form>
                    </div>

                    {/* Budgets List Grid */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-semibold text-white">Active Budgets</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {budgets.length === 0 ? (
                                <p className="text-slate-400 text-sm col-span-full py-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">No budgets set yet.</p>
                            ) : (
                                budgets.map((b) => (
                                    <div key={b._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                                        <div>
                                            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{b.category}</span>
                                            <div className="text-xl font-bold text-white mt-1">Rs. {b.monthlyLimit}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">Monthly Limit</div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(b._id)}
                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition"
                                            title="Delete Budget"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}