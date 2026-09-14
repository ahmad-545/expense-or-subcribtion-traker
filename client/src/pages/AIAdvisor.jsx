import { useState, useEffect, useRef, useContext } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { 
    Bot, Sparkles, Send, RefreshCw, DollarSign, TrendingDown, 
    Calendar, Copy, Check, Trash2, ArrowRight, User as UserIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const QUICK_PROMPTS = [
    { label: "💡 How can I save more this month?", query: "How can I cut unnecessary expenses and save more money this month?" },
    { label: "📊 Analyze top spending category", query: "What is my highest spending category and how can I optimize it?" },
    { label: "⚠️ Any budgets close to limit?", query: "Are any of my category budgets exceeded or near the limit?" },
    { label: "💳 Audit my subscriptions", query: "Which subscriptions am I paying for, and are there any recommendations?" },
];

export default function AIAdvisor() {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [userQuery, setUserQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [metrics, setMetrics] = useState({ totalExpense: 0, subCount: 0 });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Initial load: Fetch quick metrics & initial AI greeting report
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [expRes, subRes] = await Promise.all([
                API.get('/expenses'),
                API.get('/subscriptions')
            ]);
            const exps = Array.isArray(expRes.data) ? expRes.data : [];
            const subs = Array.isArray(subRes.data) ? subRes.data : [];
            const total = exps.reduce((s, e) => s + Number(e.amount || 0), 0);
            setMetrics({ totalExpense: total, subCount: subs.length });
        } catch (e) {
            console.error("Error loading metrics", e);
        }

        // Generate first greeting
        fetchInitialAdvice();
    };

    const fetchInitialAdvice = async () => {
        setLoading(true);
        try {
            const { data } = await API.post('/ai/report', { 
                userQuery: "Hello! Please give me a brief welcome, summarize my current financial health, and give me 3 top tips based on my recorded data." 
            });
            setMessages([
                {
                    id: 1,
                    role: 'assistant',
                    content: data.advice || "Hello! I am your AI Financial Advisor. How can I help you manage your finances today?",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } catch (err) {
            console.error("AI initial advice error", err);
            setMessages([
                {
                    id: 1,
                    role: 'assistant',
                    content: "Assalam-o-Alaikum! Main aapka AI Financial Advisor hoon. Aap mujh se apne kharche, savings, ya subscriptions ke bare me koi bhi sawal pooch sakte hain!",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (queryToSend) => {
        const text = (queryToSend || userQuery).trim();
        if (!text || loading) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setUserQuery('');
        setLoading(true);

        try {
            // Send past 4 messages for multi-turn conversational context
            const chatHistory = updatedMessages.slice(-4).map(m => ({
                role: m.role,
                content: m.content
            }));

            const { data } = await API.post('/ai/report', { 
                userQuery: text,
                chatHistory: chatHistory
            });

            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.advice || "No response received.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error("Error asking AI", err);
            toast.error("Failed to reach AI Advisor. Please try again.");
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: "Maaf kijiye ga, AI server se connect hone me masla pesh aya. Baraye meherbani thori der baad dobara koshish kijiye.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (content, index) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        toast.success("Advice copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleClearChat = () => {
        setMessages([]);
        fetchInitialAdvice();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative selection:bg-emerald-500 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 w-full md:h-screen md:overflow-hidden">
                <Navbar />
                <main className="flex-1 md:overflow-y-auto bg-[#030814] flex flex-col">
                    <div className="max-w-5xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col space-y-4">
                        
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                                    <Bot size={26} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Financial Advisor</h1>
                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                                            <Sparkles size={10} /> Active
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs md:text-sm mt-0.5">
                                        Real-time personalized financial advice, savings tips & budget insights in Urdu or English.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={handleClearChat}
                                    title="Reset Conversation"
                                    className="p-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition hover:bg-slate-900"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleSendMessage("Please provide a comprehensive financial health audit and recommendations.")}
                                    disabled={loading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-xs md:text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Full Audit
                                </button>
                            </div>
                        </div>

                        {/* Financial Snapshot Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Monthly Income</span>
                                <div className="text-base md:text-lg font-extrabold text-white mt-0.5">
                                    Rs. {Number(user?.monthlyIncome || 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Spent</span>
                                <div className="text-base md:text-lg font-extrabold text-emerald-400 mt-0.5">
                                    Rs. {metrics.totalExpense.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Saving Target</span>
                                <div className="text-base md:text-lg font-extrabold text-white mt-0.5">
                                    Rs. {Number(user?.savingGoal || 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Subs</span>
                                <div className="text-base md:text-lg font-extrabold text-white mt-0.5">
                                    {metrics.subCount} subscriptions
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Container */}
                        <div className="flex-1 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col justify-between overflow-hidden min-h-[380px]">
                            <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[52vh] scrollbar-thin scrollbar-thumb-slate-800">
                                {messages.map((msg, index) => (
                                    <div 
                                        key={msg.id || index} 
                                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1 shadow-sm">
                                                <Bot size={18} />
                                            </div>
                                        )}

                                        <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-md ${
                                            msg.role === 'user' 
                                                ? 'bg-emerald-600 text-white rounded-tr-none' 
                                                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                                        }`}>
                                            <div className="whitespace-pre-line prose prose-invert max-w-none text-xs md:text-sm">
                                                {msg.content}
                                            </div>

                                            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10 text-[10px] opacity-70">
                                                <span>{msg.time}</span>
                                                {msg.role === 'assistant' && (
                                                    <button 
                                                        onClick={() => handleCopy(msg.content, index)}
                                                        className="hover:text-emerald-400 transition flex items-center gap-1"
                                                        title="Copy text"
                                                    >
                                                        {copiedIndex === index ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                        <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 shadow-sm font-bold text-xs">
                                                {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={16} />}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1 animate-pulse">
                                            <Bot size={18} />
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-md flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                                            <span className="text-xs text-slate-400 ml-2">Advisor is analyzing your expenses...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Suggestion Chips */}
                            <div className="pt-3 border-t border-slate-800/80">
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                    {QUICK_PROMPTS.map((p, idx) => (
                                        <button
                                            key={idx}
                                            disabled={loading}
                                            onClick={() => handleSendMessage(p.query)}
                                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 text-xs whitespace-nowrap transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-95"
                                        >
                                            <span>{p.label}</span>
                                            <ArrowRight size={12} className="text-emerald-400" />
                                        </button>
                                    ))}
                                </div>

                                {/* Message Input Box */}
                                <form 
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
                                    className="flex gap-2 pt-2"
                                >
                                    <input 
                                        type="text"
                                        placeholder="Poochiye: e.g. 'Mera kharcha kam karne ka tarika batao' or in English..."
                                        value={userQuery}
                                        onChange={(e) => setUserQuery(e.target.value)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs md:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition placeholder:text-slate-500"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={loading || !userQuery.trim()}
                                        className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition flex items-center gap-2 text-xs md:text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95 shrink-0"
                                    >
                                        <Send size={16} />
                                        <span className="hidden sm:inline">Ask AI</span>
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}