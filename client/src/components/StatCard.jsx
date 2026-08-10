export default function StatCard({ title, value, icon: Icon, colorClass = "text-brand-500" }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-medium">{title}</span>
                <div className={`p-2.5 rounded-xl bg-slate-800/80 ${colorClass}`}>
                    <Icon size={22} />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-white mt-4 tracking-tight">{value}</h2>
        </div>
    );
}