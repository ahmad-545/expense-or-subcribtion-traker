import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, TrendingUp, DollarSign, Target, PieChart, Zap } from 'lucide-react';

// Custom simple float animation class defined directly in JSX style prop for safety
const floatAnimation = {
  animation: 'float 6s ease-in-out infinite',
};

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
    <div className="min-h-screen flex items-center justify-center bg-[#030014] px-4 py-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* --- Inline Keyframes for Animation (Self-contained for Vercel safety) --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* --- Background Animation Layers (Video Style) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large Glowing Gradient Blobs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]"></div>

        {/* Background Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        {/* --- Floating Animated Icons (Finance Symbols) --- */}
        {/* Symbol 1: Trending Up (Green) */}
        <div className="absolute top-20 left-[10%] text-emerald-500/30" style={floatAnimation}>
          <TrendingUp size={64} strokeWidth={1.5} />
        </div>
        
        {/* Symbol 2: Dollar Sign (Blue) */}
        <div className="absolute bottom-32 right-[12%] text-blue-500/30" style={{ ...floatAnimation, animationDelay: '1.5s' }}>
          <DollarSign size={72} strokeWidth={1} />
        </div>

        {/* Symbol 3: Target/Goal (Purple) */}
        <div className="absolute top-1/3 right-[25%] text-purple-500/20" style={{ ...floatAnimation, animationDelay: '3s' }}>
          <Target size={50} strokeWidth={2} />
        </div>

        {/* Symbol 4: Pie Chart (Emerald/Blue) */}
        <div className="absolute bottom-20 left-[20%] text-emerald-500/20" style={{ ...floatAnimation, animationDelay: '4.5s' }}>
          <PieChart size={56} strokeWidth={1.5} />
        </div>

        {/* Symbol 5: Zap/Alert (Blue/White) */}
        <div className="absolute top-1/4 left-[40%] text-blue-400/15" style={{ ...floatAnimation, animationDelay: '0.5s' }}>
          <Zap size={40} strokeWidth={2} />
        </div>
      </div>

      {/* --- Glassmorphism Card --- */}
      <div className="max-w-md w-full bg-slate-900/70 border border-slate-800/70 rounded-[32px] p-10 shadow-2xl backdrop-blur-3xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tighter">
            ExpenseAI<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4.5 top-3.5 text-slate-500" size={20} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="name@example.com"
                className="w-full pl-12 pr-5 py-3.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-white text-base focus:outline-none focus:border-emerald-500 transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4.5 top-3.5 text-slate-500" size={20} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-5 py-3.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-white text-base focus:outline-none focus:border-emerald-500 transition duration-200"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 text-base disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-slate-400 text-center text-sm mt-8">
          Don't have an account? <Link to="/register" className="text-emerald-400 hover:underline font-semibold">Create account</Link>
        </p>
      </div>
    </div>
  );
}