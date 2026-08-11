import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, DollarSign, Target, ArrowRight } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        monthlyIncome: '',
        savingGoal: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Register function call without phone number
        const res = await register(
            formData.name, 
            formData.email, 
            formData.password, 
            Number(formData.monthlyIncome), 
            Number(formData.savingGoal)
        );
        
        setLoading(false);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 font-sans selection:bg-emerald-500 selection:text-white">
            <div className="max-w-md w-full bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        ExpenseAI<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Create an account to get smart email reminders.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-xs sm:text-sm animate-shake">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                placeholder="John Doe" 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="name@example.com" 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                placeholder="••••••••" 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Monthly Income</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3.5 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" 
                                    name="monthlyIncome" 
                                    value={formData.monthlyIncome} 
                                    onChange={handleChange} 
                                    placeholder="50000" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Saving Goal</label>
                            <div className="relative">
                                <Target className="absolute left-3.5 top-3 text-slate-500" size={18} />
                                <input 
                                    type="number" 
                                    name="savingGoal" 
                                    value={formData.savingGoal} 
                                    onChange={handleChange} 
                                    placeholder="10000" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" 
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full mt-3 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={16} />
                    </button>
                </form>

                <p className="text-slate-400 text-center text-xs sm:text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-emerald-400 hover:underline font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}