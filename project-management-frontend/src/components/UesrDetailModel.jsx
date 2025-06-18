import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserDetailModal = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative transform scale-95 animate-slide-up border border-blue-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-transform transform hover:rotate-90"
        >
          &times;
        </button>

        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">ব্যবহারকারীর প্রোফাইল</h2>

        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-6xl font-bold mb-4 border-4 border-blue-300 shadow-lg">
            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{user.username}</p>
          <p className="text-gray-700 text-lg mb-1">{user.email}</p>
          <p className="text-gray-500 text-sm">ID: {user.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* মালিকানাধীন প্রজেক্ট */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">মালিকানাধীন প্রজেক্টস ({user.ownedProjects?.length || 0})</h3>
            {user.ownedProjects && user.ownedProjects.length > 0 ? (
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {user.ownedProjects.map((project) => (
                  <li key={project.id} className="text-gray-700 font-medium bg-white p-2 rounded-lg shadow-xs border border-gray-100">
                    {project.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">কোনো মালিকানাধীন প্রজেক্ট নেই।</p>
            )}
          </div>

          {/* সদস্যপদ */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">সদস্যপদ ({user.memberships?.length || 0})</h3>
            {user.memberships && user.memberships.length > 0 ? (
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {user.memberships.map((membership) => (
                  <li key={membership.project_id} className="text-gray-700 font-medium bg-white p-2 rounded-lg shadow-xs border border-gray-100">
                    {membership.project_name} (<span className="capitalize">{membership.role}</span>)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">কোনো সদস্যপদ নেই।</p>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            লগআউট
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
