import { useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

export default function AIAdvisor() {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyzeSpending = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/ai/analyze');
            setAnalysis(data.analysis);
        } catch (err) {
            console.error("Error analyzing spending", err);
            setAnalysis("Failed to generate AI analysis. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">AI Financial Advisor</h1>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Get personalized financial reports and spending insights powered by AI.</p>
                        </div>
                        <button 
                            onClick={handleAnalyzeSpending}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition shadow-lg shadow-brand-500/20 text-xs md:text-sm disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            Analyze My Spending
                        </button>
                    </div>

                    {/* AI Output Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm min-h-[400px] flex flex-col">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
                            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-sm md:text-base">Gemini AI Financial Insights</h3>
                                <p className="text-xs text-slate-400">Real-time analysis of your expenses and subscriptions</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-3">
                                <Loader2 className="animate-spin text-brand-500" size={40} />
                                <p className="text-slate-400 text-sm">Analyzing your financial patterns...</p>
                            </div>
                        ) : analysis ? (
                            <div className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-line bg-slate-950 p-4 md:p-6 rounded-xl border border-slate-800">
                                {analysis}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                                <Bot className="text-slate-700 mb-3" size={56} />
                                <p className="text-slate-400 text-xs md:text-sm max-w-md">Click the "Analyze My Spending" button above to get smart savings recommendations and budget analysis.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}