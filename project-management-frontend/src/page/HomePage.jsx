import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import landingImage from '../assets/360_F_281970265_KR6Ey4XF3miLYq0QDp3WsH0m35MR2tGC.jpg';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 relative overflow-hidden"
      style={{
        backgroundImage: `url(${landingImage})`     , // একটি ল্যান্ডিং পেজ ব্যাকগ্রাউন্ড ইমেজ যুক্ত করা হয়েছে
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // স্ক্রল করার সময় ইমেজ ফিক্সড থাকবে
      }}
    >
      {/* ব্যাকগ্রাউন্ড ইমেজের উপরে একটি সেমি-ট্রান্সপারেন্ট ওভারলে যোগ করা হয়েছে */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 text-center bg-white bg-opacity-90 p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-5xl w-full transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight animate-fade-in-down">
          Unlock Your Team's Full Potential
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-10 max-w-3xl mx-auto animate-fade-in-up">
          ProjectPlus is your all-in-one solution for seamless project management. Organize tasks, collaborate effortlessly, and drive your projects to success with powerful, intuitive tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
          <div className="bg-blue-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Intuitive Task Tracking</h3>
            <p className="text-gray-700 text-sm">Visually manage your workflows with drag-and-drop ease. Prioritize, assign, and monitor tasks from To-Do to Done.</p>
          </div>
          <div className="bg-green-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in delay-100">
            <h3 className="text-xl font-bold text-green-800 mb-3">Streamlined Collaboration</h3>
            <p className="text-gray-700 text-sm">Bring your team together. Share files, comment on tasks, and stay aligned with real-time updates.</p>
          </div>
          <div className="bg-purple-50 bg-opacity-80 p-6 rounded-xl shadow-md border border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in delay-200">
            <h3 className="text-xl font-bold text-purple-800 mb-3">Actionable Insights</h3>
            <p className="text-gray-700 text-sm">Gain clear visibility into project progress, identify bottlenecks, and make data-driven decisions.</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4 animate-fade-in-up delay-300">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-b-4 border-blue-800 hover:border-blue-900"
            >
              Go to Your Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-b-4 border-green-800 hover:border-green-900"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-b-4 border-indigo-800 hover:border-indigo-900"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
