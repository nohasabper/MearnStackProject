import axios from 'axios';
import store from './Store';
import { logout } from './Slices/Auth';

axios.defaults.baseURL = 'http://localhost:8080'; 
axios.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // If unauthorized, logout the user
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
            // Optionally, redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
