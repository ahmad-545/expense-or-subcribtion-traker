import { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import StatCard from './StatCard';
import ExpenseModal from './ExpenseModal';
import { AuthContext } from '../context/AuthContext';
import { Wallet, TrendingUp, CreditCard, AlertTriangle, Plus, DollarSign, Target, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

export default function DashboardContent() {
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const expRes = await API.get('/expenses');
            const subRes = await API.get('/subscriptions');
            const budgetRes = await API.get('/budgets');
            const alertRes = await API.get('/alerts');

            setExpenses(expRes.data);
            setSubscriptions(subRes.data);
            setBudgets(budgetRes.data);
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

    // Prepare data for Category Breakdown with Percentages
    const categoryDataUnprocessed = expenses.reduce((acc, curr) => {
        const found = acc.find(item => item.name === curr.category);
        if (found) {
            found.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, []);

    const categoryData = categoryDataUnprocessed.map(item => ({
        ...item,
        percentage: totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0
    }));

    // Calculate spent per category for Budget Overview
    const categorySpent = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full bg-slate-950 text-slate-100">
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        Welcome back, {user?.name || 'Ahmad'} 👋
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Here's your financial overview</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition shadow-lg shadow-emerald-500/20 text-sm"
                >
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md">
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

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Balance" 
                    value={`Rs. ${(user?.monthlyIncome || 0) - totalExpenses}`} 
                    icon={DollarSign} 
                    colorClass="text-emerald-400" 
                    trend="Available funds"
                />
                <StatCard 
                    title="Monthly Expenses" 
                    value={`Rs. ${totalExpenses}`} 
                    icon={Wallet} 
                    colorClass="text-blue-400" 
                    trend="Total spent"
                />
                <StatCard 
                    title="Saving Goal" 
                    value={`Rs. ${user?.savingGoal || 0}`} 
                    icon={Target} 
                    colorClass="text-purple-400" 
                    trend="Target savings"
                />
                <StatCard 
                    title="Active Bills" 
                    value={subscriptions.length} 
                    icon={CreditCard} 
                    colorClass="text-cyan-400" 
                    trend="Subscriptions"
                />
            </div>

            {/* 4 Main Dashboard Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Expense Overview (Donut Chart with Legend) */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <h3 className="text-base font-bold text-white mb-4">Expense Overview</h3>
                    {categoryData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No category data available.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                            <div className="h-56 w-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
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
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-slate-400">Total</span>
                                    <span className="text-sm font-bold text-white">Rs. {totalExpenses}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {categoryData.map((cat, idx) => (
                                    <div key={cat.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                            <span className="text-slate-300 font-medium">{cat.name}</span>
                                        </div>
                                        <span className="text-slate-400 font-semibold">{cat.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Upcoming Subscriptions Widget */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white">Upcoming Subscriptions</h3>
                        <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">View All</span>
                    </div>
                    {subscriptions.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No active subscriptions found.</div>
                    ) : (
                        <div className="space-y-3">
                            {subscriptions.slice(0, 4).map((sub) => (
                                <div key={sub._id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                                            {sub.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-sm">{sub.name}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Calendar size={12} /> Renewal: {new Date(sub.renewalDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white text-sm">Rs. {sub.amount}</div>
                                        <div className="text-xs text-slate-500">{sub.billingCycle}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Monthly Expenses Trend */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white">Monthly Expenses Trend</h3>
                        <span className="text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 font-medium">This Month</span>
                    </div>
                    {chartData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No trend data available yet.</div>
                    ) : (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 11}} />
                                    <YAxis stroke="#64748b" tick={{fontSize: 11}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* 4. Budget Overview (Progress Bars) */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <h3 className="text-base font-bold text-white mb-4">Budget Overview</h3>
                    {budgets.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No budgets set yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {budgets.map((b) => {
                                const spent = categorySpent[b.category] || 0;
                                const percentage = Math.min(Math.round((spent / b.monthlyLimit) * 100), 100);
                                return (
                                    <div key={b._id} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-200">{b.category}</span>
                                            <span className="text-slate-400">Rs. {spent} / Rs. {b.monthlyLimit} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                            <div 
                                                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Recent Transactions Table */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4">Recent Transactions</h3>
                {expenses.length === 0 ? (
                    <p className="text-slate-400 text-sm py-8 text-center">No expenses recorded yet. Click "Add Expense" to get started.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Category</th>
                                    <th className="py-3 px-4 font-semibold">Description</th>
                                    <th className="py-3 px-4 font-semibold">Payment Method</th>
                                    <th className="py-3 px-4 font-semibold">Amount</th>
                                    <th className="py-3 px-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {expenses.slice(0, 5).map((exp) => (
                                    <tr key={exp._id} className="hover:bg-slate-800/40 transition">
                                        <td className="py-3.5 px-4 font-medium text-emerald-400">{exp.category}</td>
                                        <td className="py-3.5 px-4 text-slate-300">{exp.description || 'N/A'}</td>
                                        <td className="py-3.5 px-4 text-slate-400">{exp.paymentMethod || 'Cash'}</td>
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