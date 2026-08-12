import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center video-bg-glow px-4 py-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
            
            {/* Animated Glow Elements jo video jaisa feel denge */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] animate-wave pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] animate-wave pointer-events-none [animation-delay:3s]"></div>

            {/* Glassmorphism Card */}
            <div className="max-w-md w-full bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        ExpenseAI<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-5 text-xs sm:text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
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
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-3 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
                    </button>
                </form>

                <p className="text-slate-400 text-center text-xs sm:text-sm mt-6">
                    Don't have an account? <Link to="/register" className="text-emerald-400 hover:underline font-medium">Create account</Link>
                </p>
            </div>
        </div>
    );
}