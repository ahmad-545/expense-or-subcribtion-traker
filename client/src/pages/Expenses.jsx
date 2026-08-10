import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ExpenseModal from '../components/ExpenseModal';
import { Plus, Search, Receipt, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const { data } = await API.get('/expenses');
            setExpenses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching expenses", err);
            setExpenses([]);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await API.delete(`/expenses/${id}`);
                toast.success("Expense deleted successfully!", { position: "top-right", autoClose: 3000 });
                fetchExpenses();
            } catch (err) {
                console.error("Error deleting expense", err);
                toast.error("Failed to delete expense");
            }
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

    const filteredExpenses = Array.isArray(expenses) ? expenses.filter(exp => {
        const matchesSearch = exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) || exp.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) : [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Expense Management</h1>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Track, search, and manage all your daily spendings.</p>
                        </div>
                        <button 
                            onClick={handleOpenAddModal}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-lg shadow-brand-500/20 text-xs md:text-sm"
                        >
                            <Plus size={18} /> Add Expense
                        </button>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search expenses..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs md:text-sm focus:outline-none focus:border-brand-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                            {['All', 'Food', 'Grocery', 'Rent', 'Bills', 'Petrol', 'Shopping', 'Entertainment', 'Other'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 md:px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                                        selectedCategory === cat 
                                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                                            : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expenses Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
                        {filteredExpenses.length === 0 ? (
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
                                                <td className="py-3.5 px-4 font-medium text-brand-400">{exp.category}</td>
                                                <td className="py-3.5 px-4 text-slate-300">{exp.description || 'N/A'}</td>
                                                <td className="py-3.5 px-4 text-slate-400">{exp.paymentMethod}</td>
                                                <td className="py-3.5 px-4 font-semibold text-white">Rs. {exp.amount}</td>
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
                                                            onClick={() => handleDelete(exp._id)} 
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

                    <ExpenseModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onExpenseAdded={fetchExpenses}
                        expenseToEdit={expenseToEdit}
                    />
                </main>
            </div>
        </div>
    );
}