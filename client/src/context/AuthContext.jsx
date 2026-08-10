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

    const register = async (name, email, password, phone, monthlyIncome, savingGoal) => {
        try {
            await API.post('/auth/register', { name, email, password, phone, monthlyIncome, savingGoal });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.error || err.response?.data?.message || "Registration failed" };
        }
    };

    const updateProfile = async (monthlyIncome, savingGoal, phone) => {
        try {
            const { data } = await API.put('/auth/update-profile', { 
                monthlyIncome: Number(monthlyIncome), 
                savingGoal: Number(savingGoal), 
                phone 
            });
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, message: data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.error || err.response?.data?.message || "Profile update failed" };
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
        <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};