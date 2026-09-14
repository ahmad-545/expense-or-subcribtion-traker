import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import StatCard from './StatCard';
import ExpenseModal from './ExpenseModal';
import { AuthContext } from '../context/AuthContext';
import { Wallet, TrendingUp, CreditCard, AlertTriangle, Plus, DollarSign, Target, Calendar, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

// ────────────── Skeleton Loader ──────────────
function SkeletonCard() {
    return (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-3 w-24 bg-slate-700 rounded-full" />
                <div className="h-9 w-9 bg-slate-700 rounded-xl" />
            </div>
            <div className="h-7 w-32 bg-slate-700 rounded-full mb-2" />
            <div className="h-3 w-20 bg-slate-800 rounded-full" />
        </div>
    );
}

function SkeletonBlock({ h = 64 }) {
    return (
        <div className={`bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 animate-pulse h-${h}`}>
            <div className="h-4 w-32 bg-slate-700 rounded-full mb-4" />
            <div className="space-y-3">
                <div className="h-3 w-full bg-slate-800 rounded-full" />
                <div className="h-3 w-4/5 bg-slate-800 rounded-full" />
                <div className="h-3 w-3/5 bg-slate-800 rounded-full" />
            </div>
        </div>
    );
}

// ────────────── Savings Ring ──────────────
function SavingsRing({ saved, goal }) {
    const pct = goal > 0 ? Math.min(Math.round((saved / goal) * 100), 100) : 0;
    const r = 54;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const color = pct >= 100 ? '#22c55e' : pct >= 60 ? '#06b6d4' : pct >= 30 ? '#f59e0b' : '#ec4899';

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
                <svg width="128" height="128" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
                    <circle
                        cx="64" cy="64" r={r} fill="none"
                        stroke={color} strokeWidth="10"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 64 64)"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">{pct}%</span>
                    <span className="text-xs text-slate-400">Saved</span>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Saved So Far</p>
                    <p className="text-white font-bold text-lg">Rs. {Math.max(0, saved).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Saving Goal</p>
                    <p className="font-semibold text-slate-300">Rs. {goal.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Still Needed</p>
                    <p className="font-semibold" style={{ color }}>
                        Rs. {Math.max(0, goal - saved).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DashboardContent() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [expRes, subRes, budgetRes, alertRes] = await Promise.all([
                API.get('/expenses'),
                API.get('/subscriptions'),
                API.get('/budgets'),
                API.get('/alerts'),
            ]);
            setExpenses(expRes.data);
            setSubscriptions(subRes.data);
            setBudgets(budgetRes.data);
            setAlerts(alertRes.data.alerts);
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    // ── Current Month Filter ──
    const now = new Date();
    const currentMonthExpenses = expenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalExpenses = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const balance = (user?.monthlyIncome || 0) - totalExpenses;
    const saved = balance > 0 ? balance : 0;

    const chartData = currentMonthExpenses.reduce((acc, curr) => {
        const date = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const found = acc.find(item => item.date === date);
        if (found) { found.amount += curr.amount; }
        else { acc.push({ date, amount: curr.amount }); }
        return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    const categoryDataUnprocessed = currentMonthExpenses.reduce((acc, curr) => {
        const found = acc.find(item => item.name === curr.category);
        if (found) { found.value += curr.amount; }
        else { acc.push({ name: curr.category, value: curr.amount }); }
        return acc;
    }, []);

    const categoryData = categoryDataUnprocessed.map(item => ({
        ...item,
        percentage: totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0
    }));

    const categorySpent = currentMonthExpenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const statCards = [
        { title: "Total Balance", value: `Rs. ${balance.toLocaleString()}`, icon: DollarSign, colorClass: balance >= 0 ? "text-emerald-400" : "text-red-400", trend: "This month" },
        { title: "Monthly Expenses", value: `Rs. ${totalExpenses.toLocaleString()}`, icon: Wallet, colorClass: "text-blue-400", trend: monthName },
        { title: "Saving Goal", value: `Rs. ${(user?.savingGoal || 0).toLocaleString()}`, icon: Target, colorClass: "text-purple-400", trend: "Target savings" },
        { title: "Active Bills", value: subscriptions.length, icon: CreditCard, colorClass: "text-cyan-400", trend: "Subscriptions" },
    ];

    return (
        <div className="relative w-full bg-[#030814] text-slate-100 p-4 sm:p-6 md:p-8">
            {/* AMBIENT BACKGROUND */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-70 z-0">
                <div className="glow-animation absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.06] blur-[130px]" />
                <div className="glow-animation absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.06] blur-[130px]" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative z-10 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full pb-12">
                {/* Top Action Bar */}
                <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words">
                            Welcome back, {user?.name || 'User'} <span className="animate-wave">👋</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Financial overview for <span className="text-emerald-400 font-semibold">{monthName}</span></p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative flex items-center justify-center gap-2 overflow-hidden px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 text-sm active:scale-95 w-full sm:w-auto"
                    >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <Plus size={18} className="relative transition-transform duration-300 group-hover:rotate-90" />
                        <span className="relative">Add Expense</span>
                    </button>
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="animate-fade-in-up bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md shadow-[0_0_25px_rgba(239,68,68,0.1)]">
                        <AlertTriangle className="text-red-400 mt-0.5 flex-shrink-0 animate-pulse" size={20} />
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
                    {loading
                        ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                        : statCards.map((card, idx) => (
                            <div key={card.title} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in-up transition-transform duration-300 hover:-translate-y-1">
                                <StatCard title={card.title} value={card.value} icon={card.icon} colorClass={card.colorClass} trend={card.trend} />
                            </div>
                        ))
                    }
                </div>

                {/* Main Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SkeletonBlock h={72} />
                        <SkeletonBlock h={72} />
                        <SkeletonBlock h={72} />
                        <SkeletonBlock h={72} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 1. Expense Overview (Pie) */}
                        <div className="animate-fade-in-up delay-100 group relative bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm transition-colors duration-300 flex flex-col overflow-hidden">
                            <h3 className="text-base font-bold text-white mb-4">Expense Overview — {monthName}</h3>
                            {categoryData.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
                                    <PieIcon size={40} className="opacity-30" />
                                    <p>No expenses this month yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                                    <div className="h-56 w-full flex items-center justify-center relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-xs text-slate-400">Total</span>
                                            <span className="text-sm font-bold text-white">Rs. {totalExpenses.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                        {categoryData.map((cat, idx) => (
                                            <div key={cat.name} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 truncate pr-2">
                                                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                    <span className="text-slate-300 font-medium truncate">{cat.name}</span>
                                                </div>
                                                <span className="text-slate-400 font-semibold flex-shrink-0">{cat.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. Savings Progress Ring */}
                        <div className="animate-fade-in-up delay-200 group relative bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm transition-colors duration-300 overflow-hidden">
                            <h3 className="text-base font-bold text-white mb-5">Savings Progress</h3>
                            {(user?.savingGoal || 0) === 0 ? (
                                <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                                    <Target size={36} className="opacity-30" />
                                    <p>Set a saving goal in your Profile.</p>
                                    <button onClick={() => navigate('/profile')} className="mt-2 text-xs text-emerald-400 hover:underline flex items-center gap-1">
                                        Go to Profile <ArrowRight size={12} />
                                    </button>
                                </div>
                            ) : (
                                <SavingsRing saved={saved} goal={user?.savingGoal || 0} />
                            )}
                        </div>

                        {/* 3. Monthly Expenses Trend */}
                        <div className="animate-fade-in-up delay-300 group relative bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm transition-colors duration-300 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-white">Expenses Trend</h3>
                                <span className="text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 font-medium">{monthName}</span>
                            </div>
                            {chartData.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                                    <TrendingUp size={36} className="opacity-30" />
                                    <p>No data for this month yet.</p>
                                </div>
                            ) : (
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                                            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                                            <Area type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* 4. Budget Overview */}
                        <div className="animate-fade-in-up delay-400 group relative bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm transition-colors duration-300 flex flex-col overflow-hidden">
                            <h3 className="text-base font-bold text-white mb-4">Budget Overview</h3>
                            {budgets.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                                    <Wallet size={36} className="opacity-30" />
                                    <p>No budgets set yet.</p>
                                    <button onClick={() => navigate('/budgets')} className="mt-2 text-xs text-emerald-400 hover:underline flex items-center gap-1">
                                        Set Budgets <ArrowRight size={12} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                                    {budgets.map((b) => {
                                        const spent = categorySpent[b.category] || 0;
                                        const pct = Math.min(Math.round((spent / b.monthlyLimit) * 100), 100);
                                        const over = spent > b.monthlyLimit;
                                        return (
                                            <div key={b._id} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-medium gap-2">
                                                    <span className="text-slate-200 truncate">{b.category}</span>
                                                    <span className={`flex-shrink-0 ${over ? 'text-red-400' : 'text-slate-400'}`}>
                                                        Rs. {spent} / {b.monthlyLimit} ({pct}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ease-out ${over ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-cyan-400'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                {over && <p className="text-xs text-red-400 font-medium">⚠ Budget exceeded by Rs. {spent - b.monthlyLimit}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. Upcoming Subscriptions */}
                <div className="animate-fade-in-up delay-500 group relative bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm transition-colors duration-300 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white">Upcoming Subscriptions</h3>
                        <button
                            onClick={() => navigate('/subscriptions')}
                            className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight size={13} />
                        </button>
                    </div>
                    {loading ? (
                        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-800/50 rounded-xl animate-pulse" />)}</div>
                    ) : subscriptions.length === 0 ? (
                        <div className="h-24 flex items-center justify-center text-slate-500 text-sm">No active subscriptions found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {subscriptions.slice(0, 4).map((sub) => (
                                <div key={sub._id} className="flex items-center gap-3 p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl hover:border-emerald-500/30 transition-colors duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {sub.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-semibold text-white text-sm truncate">{sub.name}</div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Calendar size={11} className="flex-shrink-0" />
                                            <span className="truncate">{new Date(sub.renewalDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-xs font-bold text-emerald-400 mt-0.5">Rs. {sub.amount}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 6. Recent Transactions */}
                <div className="animate-fade-in-up group relative bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm transition-colors duration-300 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white">Recent Transactions</h3>
                        <button onClick={() => navigate('/expenses')} className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-1">
                            View All <ArrowRight size={13} />
                        </button>
                    </div>
                    {loading ? (
                        <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />)}</div>
                    ) : expenses.length === 0 ? (
                        <p className="text-slate-400 text-sm py-8 text-center">No expenses recorded yet. Click "Add Expense" to get started.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="py-3 px-3 font-semibold">Category</th>
                                        <th className="py-3 px-3 font-semibold">Description</th>
                                        <th className="py-3 px-3 font-semibold">Method</th>
                                        <th className="py-3 px-3 font-semibold">Amount</th>
                                        <th className="py-3 px-3 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {expenses.slice(0, 6).map((exp) => (
                                        <tr key={exp._id} className="hover:bg-slate-800/40 transition-colors duration-200">
                                            <td className="py-3 px-3 font-medium text-emerald-400">{exp.category}</td>
                                            <td className="py-3 px-3 text-slate-300 max-w-[140px] truncate">{exp.description || '—'}</td>
                                            <td className="py-3 px-3 text-slate-400">{exp.paymentMethod || 'Cash'}</td>
                                            <td className="py-3 px-3 font-semibold text-white">Rs. {exp.amount.toLocaleString()}</td>
                                            <td className="py-3 px-3 text-slate-400">{new Date(exp.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onExpenseAdded={fetchData} />
            </div>
        </div>
    );
}