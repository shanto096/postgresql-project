import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 to-blue-100 p-8 text-center font-inter">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <h1 className="text-9xl font-extrabold text-indigo-600 mb-4 animate-fade-in-down">404</h1>
        <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-fade-in-up">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-200">
          The page you're looking for doesn't exist or an other error occurred.
          Go back, or head over to ProjectPlus homepage to choose a new direction.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border-b-4 border-blue-800 hover:border-blue-900 animate-fade-in-up delay-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
