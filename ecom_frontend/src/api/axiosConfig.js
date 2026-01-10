import axios from 'axios';

// 1. Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Matches your Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add an Interceptor to attach the Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // We will store token here
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;