import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
  Lock,
  Mail,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  Zap,
  Plus,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);

      if (res.success) {
        navigate("/");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030814] px-4 py-8 font-sans">
      
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Glow - Top Left */}
        <div className="glow-animation absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

        {/* Glow - Bottom Right */}
        <div
          className="glow-animation absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]"
          style={{ animationDelay: "2s" }}
        />

        {/* Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.03] blur-[120px]" />

        {/* ================= TOP LEFT CURVES ================= */}

        <div className="absolute left-0 top-0 h-[300px] w-[360px] opacity-60">

          <div className="absolute -left-24 -top-24 h-[300px] w-[500px] rotate-[15deg] rounded-full border border-emerald-400/20" />

          <div className="absolute -left-16 -top-16 h-[250px] w-[420px] rotate-[15deg] rounded-full border border-cyan-400/10" />

          <span className="absolute left-[100px] top-[100px] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />

          <span className="absolute left-[155px] top-[135px] h-1.5 w-1.5 rounded-full bg-cyan-400" />

          <span className="absolute left-[210px] top-[165px] h-1 w-1 rounded-full bg-emerald-300" />

        </div>

        {/* ================= BOTTOM RIGHT CURVES ================= */}

        <div className="absolute bottom-0 right-0 h-[320px] w-[400px] opacity-60">

          <div className="absolute -bottom-36 -right-28 h-[300px] w-[520px] rotate-[-18deg] rounded-full border border-emerald-400/20" />

          <div className="absolute -bottom-24 -right-16 h-[250px] w-[440px] rotate-[-18deg] rounded-full border border-cyan-400/10" />

          <span className="absolute bottom-[100px] right-[90px] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />

          <span className="absolute bottom-[140px] right-[145px] h-1.5 w-1.5 rounded-full bg-cyan-400" />

        </div>

        {/* ================= DOT PATTERN ================= */}

        <div
          className="absolute right-8 top-8 h-32 w-32 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(45,212,191,0.6) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div
          className="absolute bottom-8 left-8 h-32 w-32 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(45,212,191,0.6) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* ================= PLUS SYMBOLS ================= */}

        <Plus
          size={14}
          className="absolute left-[15%] top-[20%] text-emerald-400/30"
        />

        <Plus
          size={12}
          className="absolute left-[28%] top-[35%] text-cyan-400/20"
        />

        <Plus
          size={14}
          className="absolute bottom-[25%] right-[20%] text-emerald-400/25"
        />

        <Plus
          size={12}
          className="absolute bottom-[18%] right-[12%] text-cyan-400/25"
        />

        {/* ================= FLOATING ICONS ================= */}

        <div className="float-animation absolute left-[10%] top-[18%] text-emerald-400/25">
          <TrendingUp size={58} strokeWidth={1.2} />
        </div>

        <div
          className="float-animation absolute bottom-[20%] right-[10%] text-cyan-400/25"
          style={{ animationDelay: "1.5s" }}
        >
          <DollarSign size={68} strokeWidth={1} />
        </div>

        <div
          className="float-animation absolute right-[18%] top-[30%] text-purple-400/15"
          style={{ animationDelay: "2.5s" }}
        >
          <Target size={50} strokeWidth={1.5} />
        </div>

        <div
          className="float-animation absolute bottom-[18%] left-[17%] text-emerald-400/20"
          style={{ animationDelay: "3.5s" }}
        >
          <PieChart size={54} strokeWidth={1.2} />
        </div>

        <div
          className="float-animation absolute left-[35%] top-[25%] text-cyan-300/15"
          style={{ animationDelay: "1s" }}
        >
          <Zap size={38} strokeWidth={1.5} />
        </div>

      </div>

      {/* ================= LOGIN CARD ================= */}

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">

        <div className="relative w-full max-w-md">

          {/* Card Glow */}
          <div className="absolute -inset-1 rounded-[32px] bg-emerald-500/10 blur-xl" />

          {/* Card */}
          <div className="relative rounded-[32px] border border-slate-700/60 bg-slate-900/80 p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-10">

            {/* Top Line */}
            <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

            {/* ================= LOGO ================= */}

            <div className="logo-animation relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">

              <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-800 shadow-lg shadow-emerald-500/10">

                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 42 42"
                  fill="none"
                >
                  <rect
                    x="7"
                    y="23"
                    width="5"
                    height="11"
                    rx="1"
                    fill="#10B981"
                  />

                  <rect
                    x="16"
                    y="17"
                    width="5"
                    height="17"
                    rx="1"
                    fill="#14B8A6"
                  />

                  <rect
                    x="25"
                    y="10"
                    width="5"
                    height="24"
                    rx="1"
                    fill="#22C55E"
                  />

                  <path
                    d="M7 19L14 15L20 17L30 7L35 10"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M30 7H35V12"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </div>

              <Sparkles
                size={14}
                className="absolute -right-2 -top-2 text-emerald-300"
              />

            </div>

            {/* ================= TITLE ================= */}

            <div className="mb-8 text-center">

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Expense
                <span className="text-emerald-400">AI.</span>
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Welcome back! Please enter your details.
              </p>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* ================= FORM ================= */}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}

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
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3.5 pl-12 pr-5 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>

                <div className="group relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3.5 pl-12 pr-5 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                  />

                </div>

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-500 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative">
                  {loading ? "Signing in..." : "Sign In"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="relative transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* ================= REGISTER ================= */}

            <p className="mt-8 text-center text-sm text-slate-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
              >
                Create account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}