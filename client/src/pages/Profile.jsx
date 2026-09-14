import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { User, Mail, DollarSign, Target, CheckCircle, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import API from '../services/api';

export default function Profile() {
    const { user, updateProfile } = useContext(AuthContext);

    // Profile fields
    const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || '');
    const [savingGoal, setSavingGoal] = useState(user?.savingGoal || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileMsg, setProfileMsg] = useState('');
    const [profileErr, setProfileErr] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    // Change password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwMsg, setPwMsg] = useState('');
    const [pwErr, setPwErr] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMsg(''); setProfileErr('');
        setProfileLoading(true);
        const res = await updateProfile(monthlyIncome, savingGoal, email);
        setProfileLoading(false);
        if (res.success) setProfileMsg(res.message);
        else setProfileErr(res.message);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwMsg(''); setPwErr('');
        if (newPassword.length < 6) return setPwErr('New password must be at least 6 characters.');
        if (newPassword !== confirmPassword) return setPwErr('Passwords do not match.');
        setPwLoading(true);
        try {
            await API.post('/auth/change-password', { currentPassword, newPassword });
            setPwMsg('Password changed successfully!');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            setPwErr(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setPwLoading(false);
        }
    };

    const passwordStrength = () => {
        if (!newPassword) return null;
        if (newPassword.length < 6) return { label: 'Too short', color: 'bg-red-500', pct: 25 };
        if (newPassword.length < 8) return { label: 'Weak', color: 'bg-yellow-500', pct: 50 };
        if (newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/)) return { label: 'Strong', color: 'bg-emerald-500', pct: 100 };
        return { label: 'Medium', color: 'bg-blue-400', pct: 75 };
    };
    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative selection:bg-emerald-500 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 w-full md:h-screen md:overflow-hidden">
                <Navbar />
                <main className="flex-1 md:overflow-y-auto bg-[#030814]">
                    <div className="relative w-full p-4 sm:p-6 md:p-8">
                        {/* Ambient glow matching theme */}
                        <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-60 z-0">
                            <div className="glow-animation absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.06] blur-[130px]" />
                            <div className="glow-animation absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-teal-500/[0.04] blur-[130px]" style={{ animationDelay: '2s' }} />
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-6 pb-12">
                            {/* Page Header */}
                            <div className="animate-fade-in-up">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Profile & Settings</h1>
                                <p className="text-slate-400 text-sm mt-1">Manage your income, saving goal, and account security.</p>
                            </div>

                            {/* ── Profile Card ── */}
                            <div className="animate-fade-in-up delay-100 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-sm">
                                {/* User Avatar */}
                                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-800">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl font-extrabold text-emerald-400 shadow-inner">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{user?.name || 'User'}</p>
                                        <p className="text-slate-400 text-sm">{user?.email || ''}</p>
                                    </div>
                                </div>

                                <h2 className="text-base font-bold text-white mb-4">Account Details</h2>

                                {profileMsg && (
                                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                                        <CheckCircle size={16} /> {profileMsg}
                                    </div>
                                )}
                                {profileErr && (
                                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        <AlertCircle size={16} /> {profileErr}
                                    </div>
                                )}

                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                                        <div className="relative group">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-600"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Monthly Income */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Income (Rs.)</label>
                                        <div className="relative group">
                                            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} min="0"
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-600"
                                                placeholder="e.g. 50000"
                                            />
                                        </div>
                                    </div>

                                    {/* Saving Goal */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Saving Goal (Rs.)</label>
                                        <div className="relative group">
                                            <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="number" value={savingGoal} onChange={e => setSavingGoal(e.target.value)} min="0"
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-600"
                                                placeholder="e.g. 10000"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={profileLoading}
                                        className="group relative w-full overflow-hidden rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        <span className="relative">{profileLoading ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                </form>
                            </div>

                            {/* ── Change Password Card ── */}
                            <div className="animate-fade-in-up delay-200 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <Lock size={16} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white">Change Password</h2>
                                        <p className="text-slate-500 text-xs">Keep your account secure with a strong password.</p>
                                    </div>
                                </div>

                                {pwMsg && (
                                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                                        <CheckCircle size={16} /> {pwMsg}
                                    </div>
                                )}
                                {pwErr && (
                                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        <AlertCircle size={16} /> {pwErr}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    {/* Current Password */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Current Password</label>
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type={showCurrent ? 'text' : 'password'} value={currentPassword}
                                                onChange={e => setCurrentPassword(e.target.value)} required
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-600"
                                                placeholder="••••••••"
                                            />
                                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">New Password</label>
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type={showNew ? 'text' : 'password'} value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)} required
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-600"
                                                placeholder="Min. 6 characters"
                                            />
                                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {strength && (
                                            <div className="mt-2 space-y-1">
                                                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.pct}%` }} />
                                                </div>
                                                <p className="text-xs text-slate-500">{strength.label}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Confirm New Password</label>
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)} required
                                                className={`w-full rounded-xl border bg-slate-950/80 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:ring-1 placeholder:text-slate-600 ${confirmPassword && confirmPassword !== newPassword ? 'border-red-500/60 focus:ring-red-500/20' : 'border-slate-700 focus:border-emerald-500/70 focus:ring-emerald-500/20'}`}
                                                placeholder="Repeat new password"
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {confirmPassword && confirmPassword !== newPassword && (
                                            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit" disabled={pwLoading}
                                        className="group relative w-full overflow-hidden rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        <span className="relative">{pwLoading ? 'Changing...' : 'Change Password'}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}