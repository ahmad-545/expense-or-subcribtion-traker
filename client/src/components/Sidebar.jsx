import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, CreditCard, Target, Bot, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/expenses', name: 'Expenses', icon: Receipt },
        { path: '/budgets', name: 'Budgets', icon: Target },
        { path: '/subscriptions', name: 'Subscriptions & Cards', icon: CreditCard },
        { path: '/ai-advisor', name: 'AI Advisor', icon: Bot },
    ];

    return (
        <>
            {/* Mobile Sticky Top Header */}
            <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 text-white sticky top-0 z-50 w-full shadow-md">
                <h1 className="text-lg font-bold tracking-wide">ExpenseAI<span className="text-brand-500">.</span></h1>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition focus:outline-none z-50"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)} 
                    className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs"
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between 
                transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div>
                    <div className="p-6 border-b border-slate-800 hidden md:block">
                        <h1 className="text-xl font-bold text-white tracking-wide">ExpenseAI<span className="text-brand-500">.</span></h1>
                    </div>
                    <nav className="p-4 space-y-2 mt-4 md:mt-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setIsOpen(false)} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                        isActive 
                                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} /> {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition font-medium text-sm"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}