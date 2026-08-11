import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { CreditCard, Plus, Calendar, AlertTriangle } from 'lucide-react';

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [cards, setCards] = useState([]);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    // Form states & Error states
    const [subForm, setSubForm] = useState({ name: '', amount: '', renewalDate: '', billingCycle: 'Monthly', paymentMethod: 'HBL Card' });
    const [cardForm, setCardForm] = useState({ bank: '', cardType: 'Debit', lastFourDigits: '', expiryMonth: '', expiryYear: '' });
    const [subError, setSubError] = useState('');
    const [cardError, setCardError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const subRes = await API.get('/subscriptions');
            const cardRes = await API.get('/cards');
            setSubscriptions(subRes.data);
            setCards(cardRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();
        setSubError('');
        try {
            await API.post('/subscriptions', subForm);
            setIsSubModalOpen(false);
            setSubForm({ name: '', amount: '', renewalDate: '', billingCycle: 'Monthly', paymentMethod: 'HBL Card' });
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || "Failed to add subscription";
            setSubError(msg);
        }
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        setCardError('');
        try {
            await API.post('/cards', cardForm);
            setIsCardModalOpen(false);
            setCardForm({ bank: '', cardType: 'Debit', lastFourDigits: '', expiryMonth: '', expiryYear: '' });
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || "Failed to save card";
            setCardError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative selection:bg-emerald-500 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Subscriptions & Cards</h1>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Manage your recurring bills and saved payment methods securely.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <button onClick={() => { setSubError(''); setIsSubModalOpen(true); }} className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-xs md:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                <Plus size={16} /> Add Subscription
                            </button>
                            <button onClick={() => { setCardError(''); setIsCardModalOpen(true); }} className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition text-xs md:text-sm border border-slate-800 flex items-center justify-center gap-2 shadow-sm">
                                <Plus size={16} /> Add Card
                            </button>
                        </div>
                    </div>

                    {/* Subscriptions Section */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-white">Active Subscriptions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {subscriptions.length === 0 ? (
                                <p className="text-slate-400 text-sm col-span-full py-8 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-xl">No subscriptions added yet.</p>
                            ) : (
                                subscriptions.map((sub) => (
                                    <div key={sub._id} className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-xl">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-base md:text-lg text-white">{sub.name}</h4>
                                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full">{sub.billingCycle}</span>
                                        </div>
                                        <div className="text-xl md:text-2xl font-bold text-emerald-400">Rs. {sub.amount}</div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
                                            <Calendar size={14} /> Renews on: {new Date(sub.renewalDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cards Section */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-base font-bold text-white">Saved Bank Cards</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {cards.length === 0 ? (
                                <p className="text-slate-400 text-sm col-span-full py-8 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-xl">No cards saved yet.</p>
                            ) : (
                                cards.map((card) => (
                                    <div key={card._id} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white tracking-wider">{card.bank}</span>
                                            <CreditCard className="text-emerald-400" size={24} />
                                        </div>
                                        <div className="text-lg md:text-xl font-mono tracking-widest text-slate-300">
                                            •••• •••• •••• {card.lastFourDigits}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                                            <span>{card.cardType} Card</span>
                                            <span>Expires: {card.expiryMonth}/{card.expiryYear}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add Subscription Modal */}
                    {isSubModalOpen && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-4">Add Subscription</h3>

                                {subError && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-xs md:text-sm flex items-start gap-2">
                                        <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                                        <span>{subError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleAddSubscription} className="space-y-4">
                                    <div>
                                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Service Name</label>
                                        <input type="text" placeholder="Netflix, Spotify, Gym" value={subForm.name} onChange={(e) => setSubForm({...subForm, name: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Amount (Rs.)</label>
                                        <input type="number" placeholder="500" value={subForm.amount} onChange={(e) => setSubForm({...subForm, amount: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Renewal Date</label>
                                        <input type="date" value={subForm.renewalDate} onChange={(e) => setSubForm({...subForm, renewalDate: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="submit" className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20">Save</button>
                                        <button type="button" onClick={() => setIsSubModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Add Card Modal */}
                    {isCardModalOpen && (
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-4">Save Bank Card</h3>

                                {cardError && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-xs md:text-sm flex items-start gap-2">
                                        <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                                        <span>{cardError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleAddCard} className="space-y-4">
                                    <div>
                                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Bank Name</label>
                                        <input type="text" placeholder="HBL, Meezan, UBL" value={cardForm.bank} onChange={(e) => setCardForm({...cardForm, bank: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Last 4 Digits</label>
                                        <input type="text" maxLength="4" placeholder="1234" value={cardForm.lastFourDigits} onChange={(e) => setCardForm({...cardForm, lastFourDigits: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Expiry Month</label>
                                            <input type="number" placeholder="MM" value={cardForm.expiryMonth} onChange={(e) => setCardForm({...cardForm, expiryMonth: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                        </div>
                                        <div>
                                            <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase tracking-wider">Expiry Year</label>
                                            <input type="number" placeholder="YY" value={cardForm.expiryYear} onChange={(e) => setCardForm({...cardForm, expiryYear: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="submit" className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20">Save Card</button>
                                        <button type="button" onClick={() => setIsCardModalOpen(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}