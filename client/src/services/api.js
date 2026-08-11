import axios from 'axios';

const API = axios.create({
    baseURL: 'https://expense-or-subcribtion-traker-jw8j.vercel.app/api', // Updated to live Vercel backend
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;