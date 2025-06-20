import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const SuperAdminDashboardPage = () => {
  const { isAuthenticated, isSuperAdmin, loading: authLoading, user: currentUser } = useAuth(); // currentUser যোগ করা হয়েছে
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isSuperAdmin) {
      navigate('/dashboard'); // সুপার অ্যাডমিন না হলে ড্যাশবোর্ডে রিডাইরেক্ট করুন
      alert('You do not have super admin privileges.');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, isSuperAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/super-admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users for super admin:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userIdToDelete) => {
    // সুপার অ্যাডমিন নিজেকে মুছতে পারবে না, এই চেক সার্ভারেও আছে, তবে ফ্রন্টএন্ডে থাকা ভালো।
    if (currentUser && currentUser.id === userIdToDelete) {
      alert('You cannot delete your own super admin account.');
      return;
    }

    // নিশ্চিতকরণের জন্য একটি কাস্টম মডাল ব্যবহার করা উচিত, alert/confirm() নয়
    if (window.confirm(`Are you sure you want to delete user: ${users.find(u => u.id === userIdToDelete)?.username || userIdToDelete}? This action cannot be undone.`)) {
      try {
        const res = await api.delete(`/super-admin/users/${userIdToDelete}`);
        alert(res.data.message);
        fetchUsers(); // ব্যবহারকারী মুছে ফেলার পর তালিকা রিফ্রেশ করুন
      } catch (err) {
        console.error('Error deleting user:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading Super Admin Dashboard...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-xl font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-[calc(100vh-80px)] font-inter">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Super Admin Dashboard - All Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owned Projects
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Memberships
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions {/* কলামের শিরোনাম আপডেট করা হয়েছে */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.owned_projects && user.owned_projects.length > 0 ? (
                      <ul className="list-disc list-inside text-xs">
                        {user.owned_projects.map((proj) => (
                          <li key={proj.id}>{proj.name}</li>
                        ))}
                      </ul>
                    ) : 'None'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.memberships && user.memberships.length > 0 ? (
                      <ul className="list-disc list-inside text-xs">
                        {user.memberships.map((mem) => (
                          <li key={mem.project_id}>{mem.project_name} ({mem.role})</li>
                        ))}
                      </ul>
                    ) : 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* অ্যাকশন বাটন: ব্যবহারকারীকে ডিলিট করার বাটন */}
                    {isSuperAdmin && currentUser && currentUser.id !== user.id && ( // সুপার অ্যাডমিন নিজেকে মুছতে পারবে না
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zM9 13a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboardPage;
