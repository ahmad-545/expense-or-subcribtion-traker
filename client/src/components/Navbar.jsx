import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Settings, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard Overview';
            case '/expenses': return 'Expense Management';
            case '/budgets': return 'Category Budgets';
            case '/subscriptions': return 'Subscriptions & Cards';
            case '/ai-advisor': return 'AI Financial Advisor';
            case '/profile': return 'Profile Settings';
            default: return 'Overview';
        }
    };

    const [notifications, setNotifications] = useState(() => {
        const savedNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
        return [
            ...savedNotifs,
            { id: 1, title: 'Server Alert', desc: 'Backend connection pool usage is high.', type: 'warning', time: '10m ago' },
            { id: 2, title: 'Email Service', desc: 'Nodemailer notification gateway active.', type: 'success', time: '1h ago' },
            { id: 3, title: 'New Update', desc: 'Expense tracker schema updated.', type: 'info', time: '2h ago' },
        ];
    });

    useEffect(() => {
        function handleStorageUpdate() {
            const savedNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
            setNotifications(prev => [
                ...savedNotifs,
                ...prev.filter(n => n.id === 1 || n.id === 2 || n.id === 3)
            ]);
        }

        window.addEventListener('storage_updated', handleStorageUpdate);
        return () => window.removeEventListener('storage_updated', handleStorageUpdate);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        localStorage.removeItem('app_notifications');
        setNotifications([
            { id: 1, title: 'Server Alert', desc: 'Backend connection pool usage is high.', type: 'warning', time: '10m ago' },
            { id: 2, title: 'Email Service', desc: 'Nodemailer notification gateway active.', type: 'success', time: '1h ago' },
            { id: 3, title: 'New Update', desc: 'Expense tracker schema updated.', type: 'info', time: '2h ago' },
        ]);
    };

    return (
        <header className="relative bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-4 sm:px-6 text-white sticky top-0 z-40 shadow-sm w-full flex-shrink-0">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            {/* Dynamic Page Title & Live Indicator */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-200 tracking-wide truncate">
                    {getPageTitle()}
                </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 relative transition-all duration-300 shadow-sm active:scale-90"
                        title="Notifications"
                    >
                        <Bell size={18} className="hover-wiggle" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md shadow-red-500/50 animate-pulse">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Menu */}
                    {showNotifications && (
                        <div className="animate-dropdown absolute right-0 mt-3 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                                <span className="font-bold text-sm text-slate-200">Notifications</span>
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">{notifications.length} Items</span>
                            </div>

                            <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            style={{ animationDelay: `${index * 60}ms` }}
                                            className="animate-fade-in-up p-3.5 hover:bg-slate-800/40 transition-colors duration-300 cursor-pointer flex gap-3 items-start"
                                        >
                                            <div className="mt-0.5 flex-shrink-0">
                                                {item.type === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                                                {item.type === 'success' && <CheckCircle size={16} className="text-emerald-400" />}
                                                {item.type === 'info' && <Info size={16} className="text-blue-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                                <span className="text-[10px] text-slate-500 mt-1 block font-medium">{item.time}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
                                )}
                            </div>

                            <div className="p-2.5 bg-slate-950/50 border-t border-slate-800 text-center">
                                <button onClick={markAllAsRead} className="text-xs text-emerald-400 hover:underline font-semibold">
                                    Mark all as read
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Link */}
                <Link
                    to="/profile"
                    className="group p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-all duration-300 shadow-sm active:scale-90"
                    title="Profile Settings"
                >
                    <Settings size={18} className="transition-transform duration-500 group-hover:rotate-90" />
                </Link>

                {/* User Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20 border border-emerald-500/30 flex-shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
            </div>
        </header>
    );
}