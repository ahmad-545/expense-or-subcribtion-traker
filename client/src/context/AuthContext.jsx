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

    // Phone parameter hata diya gaya hai kyunki ab hum email use kar rahe hain
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

    // Phone ki jagah email kar diya gaya hai
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