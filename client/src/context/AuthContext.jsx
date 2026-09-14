import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Login failed" };
        }
    };

    const register = async (name, email, password, monthlyIncome, savingGoal) => {
        try {
            await API.post('/auth/register', { 
                name, 
                email, 
                password, 
                monthlyIncome: Number(monthlyIncome) || 0, 
                savingGoal: Number(savingGoal) || 0 
            });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.error || err.response?.data?.message || "Registration failed" };
        }
    };

    const updateProfile = async (monthlyIncome, savingGoal, email) => {
        try {
            const { data } = await API.put('/auth/update-profile', { 
                monthlyIncome: Number(monthlyIncome) || 0, 
                savingGoal: Number(savingGoal) || 0, 
                email 
            });
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, message: data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.error || err.response?.data?.message || "Profile update failed" };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const { data } = await API.post('/auth/forgot-password', { email });
            return { success: true, message: data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Failed to send reset email" };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const { data } = await API.post(`/auth/reset-password/${token}`, { password });
            // Auto-login: token aur user store kar lo
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }
            return { success: true, message: data.message, autoLogin: !!(data.token) };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Password reset failed" };
        }
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateProfile, forgotPassword, resetPassword, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};