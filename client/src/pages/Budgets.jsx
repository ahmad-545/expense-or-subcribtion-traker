import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Plus, Trash2, AlertTriangle, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const categories = [
    'Food', 'Grocery', 'Rent', 'Bills', 'Petrol', 
    'Shopping', 'Entertainment', 'Travel', 'Education', 'Medical', 'Other'
];

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [category, setCategory] = useState('Food');
    const [monthlyLimit, setMonthlyLimit] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, category: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setFetching(true);
        try {
            const [budgetRes, expenseRes] = await Promise.all([
                API.get('/budgets'),
                API.get('/expenses')
            ]);
            setBudgets(Array.isArray(budgetRes.data) ? budgetRes.data : []);
            setExpenses(Array.isArray(expenseRes.data) ? expenseRes.data : []);
        } catch (err) {
            console.error("Error fetching budgets or expenses", err);
            toast.error("Failed to load budget data");
        } finally {
            setFetching(false);
        }
    };

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        if (!monthlyLimit || Number(monthlyLimit) <= 0) {
            toast.error("Please enter a valid monthly limit");
            return;
        }
        setLoading(true);
        try {
            await API.post('/budgets', { category, monthlyLimit: Number(monthlyLimit) });
            toast.success(`Budget for ${category} saved!`);
            setMonthlyLimit('');
            fetchData();
        } catch (err) {
            console.error("Error saving budget", err);
            toast.error(err.response?.data?.message || "Failed to save budget");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await API.delete(`/budgets/${deleteModal.id}`);
            toast.success("Budget limit removed!");
            setDeleteModal({ open: false, id: null, category: '' });
            fetchData();
        } catch (err) {
            console.error("Error deleting budget", err);
            toast.error("Failed to delete budget");
        }
    };

    // Calculate current month expenses per category
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categorySpending = expenses.reduce((acc, exp) => {
        if (!exp.date) return acc;
        const d = new Date(exp.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount || 0);
        }
        return acc;
    }, {});

    // Overall budget stats
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.monthlyLimit || 0), 0);
    const totalSpentInBudgeted = budgets.reduce((sum, b) => sum + (categorySpending[b.category] || 0), 0);
    const remainingBudget = Math.max(0, totalBudget - totalSpentInBudgeted);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative selection:bg-emerald-500 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div>
                        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Category Budgets</h1>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Set monthly spending limits for each category and track live progress.</p>
                    </div>

                    {/* Quick Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Budgeted</span>
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mt-2">Rs. {totalBudget.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">Across {budgets.length} categories</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spent This Month</span>
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                                    <TrendingUp size={18} />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mt-2">Rs. {totalSpentInBudgeted.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                {totalBudget > 0 ? `${Math.round((totalSpentInBudgeted / totalBudget) * 100)}% of total budget` : 'No budget set'}
                            </p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Buffer</span>
                                <div className={`p-2 rounded-xl ${remainingBudget > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <div className={`text-2xl font-bold mt-2 ${remainingBudget > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                Rs. {remainingBudget.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Safe spending limit remaining</p>
                        </div>
                    </div>

                    {/* Set Budget Form */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl max-w-xl">
                        <h3 className="text-base font-bold text-white mb-4">Set or Update Category Limit</h3>
                        <form onSubmit={handleSaveBudget} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Category</label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm transition"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Monthly Limit (Rs.)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 15000" 
                                    value={monthlyLimit} 
                                    onChange={(e) => setMonthlyLimit(e.target.value)} 
                                    required 
                                    min="1"
                                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm transition" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                            >
                                <Plus size={16} /> {loading ? 'Saving...' : 'Save Budget Limit'}
                            </button>
                        </form>
                    </div>

                    {/* Budgets List Grid */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-base font-bold text-white">Active Budget Tracker</h3>
                        {fetching ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl animate-pulse space-y-3">
                                        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                                        <div className="h-6 bg-slate-800 rounded w-1/2"></div>
                                        <div className="h-2 bg-slate-800 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : budgets.length === 0 ? (
                            <p className="text-slate-400 text-sm py-8 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-xl">
                                No budgets set yet. Choose a category above to set your first limit!
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {budgets.map((b) => {
                                    const spent = categorySpending[b.category] || 0;
                                    const percent = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
                                    const isExceeded = spent > b.monthlyLimit;
                                    const isNear = !isExceeded && percent >= 80;

                                    return (
                                        <div key={b._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl space-y-4 group">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{b.category}</span>
                                                    <div className="text-xl font-bold text-white mt-1">
                                                        Rs. {spent.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ Rs. {Number(b.monthlyLimit).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setDeleteModal({ open: true, id: b._id, category: b.category })}
                                                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition"
                                                    title="Delete Budget"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span className={isExceeded ? 'text-red-400 font-semibold flex items-center gap-1' : isNear ? 'text-amber-400 font-semibold flex items-center gap-1' : 'text-slate-400'}>
                                                        {isExceeded && <AlertTriangle size={12} />}
                                                        {isExceeded ? 'Over Budget!' : isNear ? 'Near Limit' : 'On Track'}
                                                    </span>
                                                    <span className="text-slate-300 font-medium">{percent}%</span>
                                                </div>
                                                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isExceeded 
                                                                ? 'bg-red-500' 
                                                                : isNear 
                                                                ? 'bg-amber-500' 
                                                                : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${Math.min(percent, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Delete Confirmation Modal */}
                    {deleteModal.open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
                                <h4 className="text-base font-bold text-white">Delete Budget Limit</h4>
                                <p className="text-sm text-slate-400">
                                    Are you sure you want to remove the monthly limit for <span className="text-white font-medium">{deleteModal.category}</span>?
                                </p>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button 
                                        onClick={() => setDeleteModal({ open: false, id: null, category: '' })}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}