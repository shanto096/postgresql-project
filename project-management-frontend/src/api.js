import axios from 'axios';

// Axios ইনস্ট্যান্স তৈরি করুন
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // আপনার ব্যাকএন্ড API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// অনুরোধে JWT টোকেন যোগ করার জন্য ইন্টারসেপ্টর সেটআপ করুন
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // লোকাল স্টোরেজ থেকে টোকেন পান
        if (token) {
            config.headers['token'] = token; // অথোরাইজেশন হেডার সেট করুন
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;