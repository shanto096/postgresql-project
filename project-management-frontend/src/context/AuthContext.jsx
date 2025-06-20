import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user এখন role প্রপার্টি ধারণ করবে
  const [loading, setLoading] = useState(true);

  // কম্পোনেন্ট মাউন্ট হওয়ার সময় ব্যবহারকারীর স্থিতি লোড করুন
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            const res = await api.get('/auth/me');
            setUser(res.data); // user অবজেক্টে এখন role প্রপার্টি থাকবে
          }
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // লগইন ফাংশন
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await api.get('/auth/me'); // সম্পূর্ণ ডেটা আবার আনুন (role সহ)
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // রেজিস্ট্রেশন ফাংশন
  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await api.get('/auth/me'); // সম্পূর্ণ ডেটা আবার আনুন (role সহ)
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // লগআউট ফাংশন
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin', // নতুন: সুপার অ্যাডমিন স্টেট
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
