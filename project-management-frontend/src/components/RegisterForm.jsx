import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // আগের ত্রুটি সাফ করুন

    if (!username || !email || !password) {
      setError('দয়া করে সমস্ত ক্ষেত্র পূরণ করুন।');
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      navigate('/dashboard'); // সফল রেজিস্ট্রেশনের পর ড্যাশবোর্ডে রিডাইরেক্ট করুন
    } else {
      setError(result.message || 'রেজিস্ট্রেশন করতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">নিবন্ধন</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6">
            <strong className="font-bold">ত্রুটি!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            ব্যবহারকারীর নাম:
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="আপনার ব্যবহারকারীর নাম লিখুন"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            ইমেইল:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেল লিখুন"
            required
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            পাসওয়ার্ড:
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 shadow-md w-full"
          >
            নিবন্ধন
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-6">
          ইতিমধ্যেই একটি অ্যাকাউন্ট আছে?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            এখানে লগইন করুন
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
