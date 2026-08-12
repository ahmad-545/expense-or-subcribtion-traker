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

    const LogoMark = ({ size = 34 }) => (
        <div className="logo-animation relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
            <div className="absolute inset-0 rounded-xl bg-emerald-400/20 blur-md" />
            <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-emerald-400/20 bg-slate-800">
                <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 42 42" fill="none">
                    <rect x="7" y="23" width="5" height="11" rx="1" fill="#10B981" />
                    <rect x="16" y="17" width="5" height="17" rx="1" fill="#14B8A6" />
                    <rect x="25" y="10" width="5" height="24" rx="1" fill="#22C55E" />
                    <path d="M7 19L14 15L20 17L30 7L35 10" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 7H35V12" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sticky Top Header - Now fully fixed on top during scroll */}
            <div className="md:hidden flex items-center justify-between bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-white sticky top-0 z-50 w-full shadow-md">
                <div className="flex items-center gap-2.5">
                    <LogoMark size={30} />
                    <h1 className="text-lg font-bold tracking-wide">ExpenseAI<span className="text-emerald-400">.</span></h1>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300 focus:outline-none z-50 active:scale-90"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs animate-fade-in-up"
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between
                transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none flex-shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent" />

                <div className="relative z-10">
                    <div className="p-6 border-b border-slate-800/80 hidden md:flex items-center gap-3">
                        <LogoMark size={36} />
                        <h1 className="text-xl font-bold text-white tracking-wide">ExpenseAI<span className="text-emerald-400">.</span></h1>
                    </div>
                    <nav className="p-4 space-y-1.5 mt-4 md:mt-2">
                        {navItems.map((item, idx) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                    className={`animate-fade-in-up group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        isActive
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}
                                    />
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="relative z-10 p-4 border-t border-slate-800/80">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 font-medium text-sm active:scale-95"
                    >
                        <LogOut size={20} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}