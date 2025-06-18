import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDetailModal from './UesrDetailModel';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [userModalOpen, setUserModalOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold font-inter tracking-wide transition transform hover:scale-105">
          প্রজেক্টপ্লাস
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <li className="flex items-center">
                  <button
                    onClick={() => setUserModalOpen(true)}
                    className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold border-2 border-blue-400 shadow hover:scale-110 transition-transform focus:outline-none mr-2"
                    title="ব্যবহারকারীর তথ্য দেখুন"
                  >
                    {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                  </button>
                  <span className="text-lg font-medium">স্বাগতম, {user?.username}!</span>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    ড্যাশবোর্ড
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    লগআউট
                  </button>
                </li>
                <UserDetailModal open={userModalOpen} onClose={() => setUserModalOpen(false)} />
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    লগইন
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="py-2 px-4 bg-purple-500 hover:bg-purple-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    নিবন্ধন
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
