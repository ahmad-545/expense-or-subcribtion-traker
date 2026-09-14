import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  Zap,
  Plus,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await forgotPassword(email);

    if (res.success) {
      setSuccess(res.message);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <main className="fixed inset-0 z-0 overflow-y-auto overflow-x-hidden bg-[#030814] font-sans">
      <div className="relative min-h-screen w-full px-4 py-8">
        {/* ===== BACKGROUND ===== */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-animation absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
          <div
            className="glow-animation absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />

          <div className="absolute left-0 top-0 hidden h-[300px] w-[360px] opacity-60 sm:block">
            <div className="absolute -left-24 -top-24 h-[300px] w-[500px] rotate-[15deg] rounded-full border border-emerald-400/20" />
            <div className="absolute -left-16 -top-16 h-[250px] w-[420px] rotate-[15deg] rounded-full border border-cyan-400/10" />
          </div>

          <div
            className="absolute right-4 top-4 hidden h-24 w-24 opacity-30 sm:block sm:right-8 sm:top-8 sm:h-32 sm:w-32"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(45,212,191,0.6) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div
            className="absolute bottom-4 left-4 hidden h-24 w-24 opacity-20 sm:block sm:bottom-8 sm:left-8 sm:h-32 sm:w-32"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(45,212,191,0.6) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          <Plus size={12} className="absolute left-[8%] top-[14%] text-emerald-400/30 sm:left-[15%] sm:top-[20%]" />
          <Plus size={10} className="absolute left-[22%] top-[30%] text-cyan-400/20" />
          <Plus size={12} className="absolute bottom-[22%] right-[14%] text-emerald-400/25" />

          <div className="float-animation absolute left-[6%] top-[14%] text-emerald-400/25 sm:left-[10%] sm:top-[18%]">
            <TrendingUp className="h-9 w-9 sm:h-[58px] sm:w-[58px]" strokeWidth={1.2} />
          </div>
          <div className="float-animation absolute bottom-[16%] right-[6%] text-cyan-400/25 sm:bottom-[20%] sm:right-[10%]" style={{ animationDelay: "1.5s" }}>
            <DollarSign className="h-10 w-10 sm:h-[68px] sm:w-[68px]" strokeWidth={1} />
          </div>
          <div className="float-animation absolute right-[10%] top-[24%] hidden text-purple-400/15 sm:block" style={{ animationDelay: "2.5s" }}>
            <Target size={50} strokeWidth={1.5} />
          </div>
          <div className="float-animation absolute bottom-[14%] left-[10%] text-emerald-400/20 sm:bottom-[18%] sm:left-[17%]" style={{ animationDelay: "3.5s" }}>
            <PieChart className="h-8 w-8 sm:h-[54px] sm:w-[54px]" strokeWidth={1.2} />
          </div>
          <div className="float-animation absolute left-[30%] top-[20%] hidden text-cyan-300/15 sm:block" style={{ animationDelay: "1s" }}>
            <Zap size={38} strokeWidth={1.5} />
          </div>
        </div>

        {/* ===== CARD ===== */}
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 rounded-[32px] bg-emerald-500/10 blur-xl" />

            <div className="relative rounded-[28px] border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:rounded-[32px] sm:p-10">
              <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

              {/* Logo */}
              <div className="logo-animation relative mx-auto mb-5 flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-800 shadow-lg shadow-emerald-500/10 sm:h-16 sm:w-16">
                  <svg width="36" height="36" viewBox="0 0 42 42" fill="none" className="sm:h-[42px] sm:w-[42px]">
                    <rect x="7" y="23" width="5" height="11" rx="1" fill="#10B981" />
                    <rect x="16" y="17" width="5" height="17" rx="1" fill="#14B8A6" />
                    <rect x="25" y="10" width="5" height="24" rx="1" fill="#22C55E" />
                    <path d="M7 19L14 15L20 17L30 7L35 10" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 7H35V12" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <Sparkles size={14} className="absolute -right-2 -top-2 text-emerald-300" />
              </div>

              {/* Title */}
              <div className="mb-6 text-center sm:mb-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Forgot <span className="text-emerald-400">Password?</span>
                </h1>
                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Success */}
              {success ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <CheckCircle size={52} className="text-emerald-400" />
                  <p className="text-sm text-slate-300 sm:text-base">{success}</p>
                  <p className="text-xs text-slate-500">
                    Please check your inbox (and spam folder) for the reset link.
                  </p>
                  <Link
                    to="/login"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    <ArrowLeft size={16} /> Back to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Email Address
                    </label>
                    <div className="group relative">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@example.com"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3 pl-12 pr-5 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10 sm:py-3.5 sm:text-base"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-500 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:py-4"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">{loading ? "Sending..." : "Send Reset Link"}</span>
                  </button>

                  <p className="mt-4 text-center text-sm text-slate-400">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                      <ArrowLeft size={14} /> Back to Login
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
