export default function StatCard({ title, value, icon: Icon, colorClass = "text-emerald-500", trend }) {
    return (
        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
                <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{value}</h2>
                {trend && (
                    <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}