import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import StatCard from './StatCard';
import ExpenseModal from './ExpenseModal';
import { AuthContext } from '../context/AuthContext';
import { Wallet, TrendingUp, CreditCard, AlertTriangle, Plus, DollarSign, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

export default function DashboardContent() {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const expRes = await API.get('/expenses');
            const subRes = await API.get('/subscriptions');
            const alertRes = await API.get('/alerts');

            setExpenses(expRes.data);
            setSubscriptions(subRes.data);
            setAlerts(alertRes.data.alerts);
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        }
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Prepare data for Area Chart (Group by Date)
    const chartData = expenses.reduce((acc, curr) => {
        const date = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const found = acc.find(item => item.date === date);
        if (found) {
            found.amount += curr.amount;
        } else {
            acc.push({ date, amount: curr.amount });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Prepare data for Category Breakdown (Pie/Donut Chart)
    const categoryData = expenses.reduce((acc, curr) => {
        const found = acc.find(item => item.name === curr.category);
        if (found) {
            found.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Financial Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor your spending trends, budgets, and active subscriptions in real-time.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-lg shadow-brand-500/20 text-sm"
                >
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="font-semibold text-red-400 text-sm">Active Reminders & Alerts</h4>
                        <ul className="text-xs text-slate-300 mt-1 space-y-1">
                            {alerts.map((alert, index) => (
                                <li key={index}>• {alert.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Stats Cards Grid (Including Monthly Income & Saving Goal) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard 
                    title="Monthly Income" 
                    value={`Rs. ${user?.monthlyIncome || 0}`} 
                    icon={DollarSign} 
                    colorClass="text-brand-500" 
                />
                <StatCard 
                    title="Saving Goal" 
                    value={`Rs. ${user?.savingGoal || 0}`} 
                    icon={Target} 
                    colorClass="text-green-500" 
                />
                <StatCard 
                    title="Total Expenses" 
                    value={`Rs. ${totalExpenses}`} 
                    icon={Wallet} 
                    colorClass="text-amber-500" 
                />
                <StatCard 
                    title="Active Subscriptions" 
                    value={subscriptions.length} 
                    icon={CreditCard} 
                    colorClass="text-blue-500" 
                />
                <StatCard 
                    title="Total Transactions" 
                    value={expenses.length} 
                    icon={TrendingUp} 
                    colorClass="text-emerald-500" 
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Spending Trend Area Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-white mb-4">Spending Trends Over Time</h3>
                    {chartData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No trend data available yet.</div>
                    ) : (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#64748b" textAnchor="end" tick={{fontSize: 12}} />
                                    <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Category Breakdown Donut Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-white mb-4">Expense by Category</h3>
                    {categoryData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No category data available.</div>
                    ) : (
                        <div className="h-64 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                {expenses.length === 0 ? (
                    <p className="text-slate-400 text-sm py-8 text-center">No expenses recorded yet. Click "Add Expense" to get started.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Category</th>
                                    <th className="py-3 px-4 font-semibold">Description</th>
                                    <th className="py-3 px-4 font-semibold">Amount</th>
                                    <th className="py-3 px-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {expenses.slice(0, 5).map((exp) => (
                                    <tr key={exp._id} className="hover:bg-slate-800/40 transition">
                                        <td className="py-3.5 px-4 font-medium text-brand-400">{exp.category}</td>
                                        <td className="py-3.5 px-4 text-slate-300">{exp.description || 'N/A'}</td>
                                        <td className="py-3.5 px-4 font-semibold text-white">Rs. {exp.amount}</td>
                                        <td className="py-3.5 px-4 text-slate-400">{new Date(exp.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Expense Modal */}
            <ExpenseModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onExpenseAdded={fetchData} 
            />
        </div>
    );
}