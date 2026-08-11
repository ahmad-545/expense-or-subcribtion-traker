import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Bot, Sparkles, Send, RefreshCw } from 'lucide-react';

export default function AIAdvisor() {
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(false);
    const [userQuery, setUserQuery] = useState('');

    const fetchAIReport = async (query = '') => {
        setLoading(true);
        try {
            const { data } = await API.post('/ai/report', { userQuery: query });
            setReport(data.advice);
        } catch (err) {
            console.error("Error fetching AI report", err);
            setReport("Failed to generate AI financial advice.");
        } finally {
            setLoading(false);
            setUserQuery('');
        }
    };

    useEffect(() => {
        fetchAIReport();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!userQuery.trim()) return;
        fetchAIReport(userQuery);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-900/40 to-slate-900 p-6 rounded-2xl border border-brand-500/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
                                <Bot size={28} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                                    AI Financial Advisor <Sparkles size={18} className="text-brand-400 animate-pulse" />
                                </h1>
                                <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                                    Ask anything about your expenses or subscriptions in English or Roman Urdu!
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => fetchAIReport()}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition shadow-lg shadow-brand-500/20 text-xs md:text-sm disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> 
                            Full Report
                        </button>
                    </div>

                    {/* Chat / Report Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative min-h-[300px] flex flex-col justify-between">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-400 text-sm animate-pulse">AI is analyzing your financial data...</p>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
                                {report || "No advice generated yet."}
                            </div>
                        )}

                        {/* Input Box for custom questions */}
                        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-slate-800">
                            <input 
                                type="text"
                                placeholder="e.g. Mera sab se zyada kharcha kis cheez par ho raha hai? (Or ask in English)"
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs md:text-sm focus:outline-none focus:border-brand-500"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition flex items-center gap-2 text-xs md:text-sm disabled:opacity-50"
                            >
                                <Send size={16} /> Ask AI
                            </button>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}