import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Subscriptions from './pages/Subscriptions';
import AIAdvisor from './pages/AIAdvisor';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        );
    }
    
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                    <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
                    <Route path="/ai-advisor" element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}