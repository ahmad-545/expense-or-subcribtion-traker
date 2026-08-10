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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">ExpenseAI<span className="text-brand-500">.</span></h1>
                    <p className="text-slate-400 text-sm mt-1">Welcome back! Please enter your details.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 text-sm disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
                    </button>
                </form>

                <p className="text-slate-400 text-center text-xs mt-8">
                    Don't have an account? <Link to="/register" className="text-brand-400 hover:underline font-medium">Create account</Link>
                </p>
            </div>
        </div>
    );
}