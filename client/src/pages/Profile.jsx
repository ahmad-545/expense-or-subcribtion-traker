import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, DollarSign, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || '');
    const [savingGoal, setSavingGoal] = useState(user?.savingGoal || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        const res = await updateProfile(monthlyIncome, savingGoal, phone);
        setLoading(false);

        if (res.success) {
            setMessage(res.message);
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 font-sans">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative text-white">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute left-6 top-8 text-slate-400 hover:text-white transition flex items-center gap-1 text-xs font-medium"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="text-center mb-6 mt-2">
                    <h1 className="text-2xl font-bold tracking-tight">Profile & Limits</h1>
                    <p className="text-slate-400 text-sm mt-1">Update your income, goals, and WhatsApp number.</p>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                        <CheckCircle size={18} /> {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-xs font-medium mb-1 uppercase tracking-wider">Full Name (Read-only)</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                value={user?.name || ''} 
                                disabled 
                                className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-slate-400 text-sm cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-300 text-xs font-medium mb-1 uppercase tracking-wider">WhatsApp Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                required 
                                placeholder="923001234567" 
                                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-300 text-xs font-medium mb-1 uppercase tracking-wider">Monthly Income</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3.5 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" 
                                    value={monthlyIncome} 
                                    onChange={(e) => setMonthlyIncome(e.target.value)} 
                                    placeholder="50000" 
                                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-300 text-xs font-medium mb-1 uppercase tracking-wider">Saving Goal</label>
                            <div className="relative">
                                <Target className="absolute left-3.5 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" 
                                    value={savingGoal} 
                                    onChange={(e) => setSavingGoal(e.target.value)} 
                                    placeholder="10000" 
                                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500" 
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full mt-4 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center shadow-lg shadow-brand-500/20 text-sm disabled:opacity-50"
                    >
                        {loading ? 'Saving Changes...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}