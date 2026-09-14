import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ExpenseModal from '../components/ExpenseModal';
import { Plus, Search, Receipt, Edit2, Trash2, Calendar, DollarSign, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-toastify';

const categories = ['All', 'Food', 'Grocery', 'Rent', 'Bills', 'Petrol', 'Shopping', 'Entertainment', 'Travel', 'Education', 'Medical', 'Other'];

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 'YYYY-MM'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/expenses');
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching expenses", err);
            toast.error("Failed to load expenses");
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await API.delete(`/expenses/${deleteModal.id}`);
            toast.success("Expense deleted successfully!");
            setDeleteModal({ open: false, id: null, title: '' });
            fetchExpenses();
        } catch (err) {
            console.error("Error deleting expense", err);
            toast.error("Failed to delete expense");
        }
    };

    const handleOpenAddModal = () => {
        setExpenseToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
    };

    // Filter logic
    const filteredExpenses = Array.isArray(expenses) ? expenses.filter(exp => {
        const matchesSearch = 
            (exp.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
            (exp.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (exp.paymentMethod?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;

        let matchesMonth = true;
        if (selectedMonth !== 'all' && exp.date) {
            const expDate = new Date(exp.date);
            const expMonthStr = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
            matchesMonth = expMonthStr === selectedMonth;
        }

        return matchesSearch && matchesCategory && matchesMonth;
    }) : [];

    // Calculate total amount for filtered view
    const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // Get unique months from all expenses for dropdown
    const availableMonths = Array.from(new Set(
        expenses
            .filter(e => e.date)
            .map(e => {
                const d = new Date(e.date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            })
    )).sort().reverse();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative selection:bg-emerald-500 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Expense Management</h1>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Track, search, and manage all your transactions with ease.</p>
                        </div>
                        <button 
                            onClick={handleOpenAddModal}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs md:text-sm"
                        >
                            <Plus size={18} /> Add Expense
                        </button>
                    </div>

                    {/* Quick Filter & Total Summary Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xl">
                            <div>
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Filtered Spend</span>
                                <div className="text-xl md:text-2xl font-bold text-white mt-1">Rs. {totalFilteredAmount.toLocaleString()}</div>
                            </div>
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                <DollarSign size={20} />
                            </div>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xl">
                            <div>
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Records</span>
                                <div className="text-xl md:text-2xl font-bold text-white mt-1">{filteredExpenses.length}</div>
                            </div>
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                                <Receipt size={20} />
                            </div>
                        </div>

                        {/* Month Selector Box */}
                        <div className="sm:col-span-2 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                            <Calendar className="text-emerald-400 shrink-0" size={20} />
                            <div className="flex-1">
                                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Filter by Month</label>
                                <select 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="all">All Months</option>
                                    {availableMonths.map(m => {
                                        const [yr, mo] = m.split('-');
                                        const label = new Date(Number(yr), Number(mo) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                                        return <option key={m} value={m}>{label}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="space-y-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by description or category..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs md:text-sm focus:outline-none focus:border-emerald-500 transition"
                                />
                            </div>
                        </div>

                        {/* Category Badges */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 md:px-4 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                                        selectedCategory === cat 
                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold' 
                                            : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expenses Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl">
                        {loading ? (
                            <div className="space-y-3 py-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-12 bg-slate-950/60 rounded-xl animate-pulse border border-slate-800/40" />
                                ))}
                            </div>
                        ) : filteredExpenses.length === 0 ? (
                            <div className="text-center py-12">
                                <Receipt className="mx-auto text-slate-600 mb-3" size={48} />
                                <p className="text-slate-400 text-sm">No expenses found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="py-3 px-4 font-semibold">Category</th>
                                            <th className="py-3 px-4 font-semibold">Description</th>
                                            <th className="py-3 px-4 font-semibold">Payment Method</th>
                                            <th className="py-3 px-4 font-semibold">Amount</th>
                                            <th className="py-3 px-4 font-semibold">Date</th>
                                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-xs md:text-sm">
                                        {filteredExpenses.map((exp) => (
                                            <tr key={exp._id} className="hover:bg-slate-800/40 transition">
                                                <td className="py-3.5 px-4 font-medium text-emerald-400">
                                                    <span className="px-2.5 py-1 bg-emerald-500/10 rounded-lg">{exp.category}</span>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-300">{exp.description || 'N/A'}</td>
                                                <td className="py-3.5 px-4 text-slate-400">{exp.paymentMethod}</td>
                                                <td className="py-3.5 px-4 font-semibold text-white">Rs. {Number(exp.amount).toLocaleString()}</td>
                                                <td className="py-3.5 px-4 text-slate-400">{exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A'}</td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleOpenEditModal(exp)} 
                                                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                                                            title="Edit Expense"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteModal({ open: true, id: exp._id, title: exp.description || exp.category })} 
                                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                                            title="Delete Expense"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Expense Modal for Add/Edit */}
                    <ExpenseModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onExpenseAdded={fetchExpenses}
                        expenseToEdit={expenseToEdit}
                    />

                    {/* Delete Confirmation Modal */}
                    {deleteModal.open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
                                <h4 className="text-base font-bold text-white">Delete Expense</h4>
                                <p className="text-sm text-slate-400">
                                    Are you sure you want to delete <span className="text-white font-medium">"{deleteModal.title}"</span>? This cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button 
                                        onClick={() => setDeleteModal({ open: false, id: null, title: '' })}
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