import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  DollarSign,
  Target,
  ArrowRight,
  TrendingUp,
  PieChart,
  Zap,
  Plus,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    monthlyIncome: "",
    savingGoal: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      navigate("/login");
    } else {
      setError(res.message);
    }
  };

  return (
    // fixed inset-0 = guaranteed full viewport coverage no matter what the
    // parent (App.jsx / #root) does with height.
    <main className="fixed inset-0 z-0 overflow-y-auto overflow-x-hidden bg-[#030814] font-sans selection:bg-emerald-500 selection:text-white">
      <div className="relative min-h-screen w-full px-4 py-8">
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
          <div className="absolute left-0 top-0 hidden h-[300px] w-[360px] opacity-60 sm:block">
            <div className="absolute -left-24 -top-24 h-[300px] w-[500px] rotate-[15deg] rounded-full border border-emerald-400/20" />
            <div className="absolute -left-16 -top-16 h-[250px] w-[420px] rotate-[15deg] rounded-full border border-cyan-400/10" />
            <span className="absolute left-[100px] top-[100px] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
            <span className="absolute left-[155px] top-[135px] h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="absolute left-[210px] top-[165px] h-1 w-1 rounded-full bg-emerald-300" />
          </div>

          {/* ================= BOTTOM RIGHT CURVES ================= */}
          <div className="absolute bottom-0 right-0 hidden h-[320px] w-[400px] opacity-60 sm:block">
            <div className="absolute -bottom-36 -right-28 h-[300px] w-[520px] rotate-[-18deg] rounded-full border border-emerald-400/20" />
            <div className="absolute -bottom-24 -right-16 h-[250px] w-[440px] rotate-[-18deg] rounded-full border border-cyan-400/10" />
            <span className="absolute bottom-[100px] right-[90px] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
            <span className="absolute bottom-[140px] right-[145px] h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </div>

          {/* ================= DOT PATTERN ================= */}
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

          {/* ================= PLUS SYMBOLS ================= */}
          <Plus size={12} className="absolute left-[8%] top-[12%] text-emerald-400/30 sm:left-[15%] sm:top-[16%] sm:h-[14px] sm:w-[14px]" />
          <Plus size={10} className="absolute left-[22%] top-[26%] text-cyan-400/20 sm:left-[28%] sm:top-[30%] sm:h-[12px] sm:w-[12px]" />
          <Plus size={12} className="absolute bottom-[18%] right-[14%] text-emerald-400/25 sm:bottom-[22%] sm:right-[20%] sm:h-[14px] sm:w-[14px]" />
          <Plus size={10} className="absolute bottom-[10%] right-[8%] text-cyan-400/25 sm:bottom-[14%] sm:right-[12%] sm:h-[12px] sm:w-[12px]" />

          {/* ================= FLOATING ICONS ================= */}
          <div className="float-animation absolute left-[6%] top-[10%] text-emerald-400/25 sm:left-[10%] sm:top-[14%]">
            <TrendingUp className="h-9 w-9 sm:h-[58px] sm:w-[58px]" strokeWidth={1.2} />
          </div>
          <div
            className="float-animation absolute bottom-[12%] right-[6%] text-cyan-400/25 sm:bottom-[16%] sm:right-[10%]"
            style={{ animationDelay: "1.5s" }}
          >
            <DollarSign className="h-10 w-10 sm:h-[68px] sm:w-[68px]" strokeWidth={1} />
          </div>
          <div
            className="float-animation absolute right-[10%] top-[20%] hidden text-purple-400/15 sm:block"
            style={{ animationDelay: "2.5s" }}
          >
            <Target size={50} strokeWidth={1.5} />
          </div>
          <div
            className="float-animation absolute bottom-[10%] left-[10%] text-emerald-400/20 sm:bottom-[14%] sm:left-[17%]"
            style={{ animationDelay: "3.5s" }}
          >
            <PieChart className="h-8 w-8 sm:h-[54px] sm:w-[54px]" strokeWidth={1.2} />
          </div>
          <div
            className="float-animation absolute left-[30%] top-[16%] hidden text-cyan-300/15 sm:block"
            style={{ animationDelay: "1s" }}
          >
            <Zap size={38} strokeWidth={1.5} />
          </div>
        </div>

        {/* ================= REGISTER CARD ================= */}

        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Card Glow */}
            <div className="absolute -inset-1 rounded-[32px] bg-emerald-500/10 blur-xl" />

            {/* Card */}
            <div className="relative rounded-[28px] border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:rounded-[32px] sm:p-10">
              {/* Top Line */}
              <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

              {/* ================= LOGO ================= */}
              <div className="logo-animation relative mx-auto mb-5 flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-800 shadow-lg shadow-emerald-500/10 sm:h-16 sm:w-16">
                  <svg width="36" height="36" viewBox="0 0 42 42" fill="none" className="sm:h-[42px] sm:w-[42px]">
                    <rect x="7" y="23" width="5" height="11" rx="1" fill="#10B981" />
                    <rect x="16" y="17" width="5" height="17" rx="1" fill="#14B8A6" />
                    <rect x="25" y="10" width="5" height="24" rx="1" fill="#22C55E" />
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

                <Sparkles size={14} className="absolute -right-2 -top-2 text-emerald-300" />
              </div>

              {/* ================= TITLE ================= */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Expense
                  <span className="text-emerald-400">AI.</span>
                </h1>
                <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                  Create an account to get smart email reminders.
                </p>
              </div>

              {/* ================= ERROR ================= */}
              {error && (
                <div className="animate-shake mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 sm:text-sm">
                  {error}
                </div>
              )}

              {/* ================= FORM ================= */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Full Name
                  </label>
                  <div className="group relative">
                    <User
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Email Address
                  </label>
                  <div className="group relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <div className="group relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Monthly Income + Saving Goal */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Monthly Income
                    </label>
                    <div className="group relative">
                      <DollarSign
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                      />
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        placeholder="50000"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Saving Goal
                    </label>
                    <div className="group relative">
                      <Target
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-400"
                      />
                      <input
                        type="number"
                        name="savingGoal"
                        value={formData.savingGoal}
                        onChange={handleChange}
                        placeholder="10000"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">
                    {loading ? "Creating Account..." : "Sign Up"}
                  </span>
                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="relative transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* ================= LOGIN LINK ================= */}
              <p className="mt-6 text-center text-xs text-slate-400 sm:text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-emerald-400 transition hover:text-emerald-300 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
