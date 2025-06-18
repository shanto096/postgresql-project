import React from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext'; // মালিকানা যাচাই করতে

const TaskCard = ({ task, projectId, onTaskUpdate, onTaskDelete, projectOwnerId }) => {
  const { user } = useAuth();
  const isOwner = user?.id === projectOwnerId;

  const handleStatusChange = async (e) => {
    try {
      const newStatus = e.target.value;
      const res = await api.patch(`/projects/${projectId}/tasks/${task.id}/status`, { status: newStatus });
      if (res.status === 200) {
        onTaskUpdate(res.data.updatedTask);
      }
    } catch (error) {
      console.error('টাস্ক স্থিতি আপডেট করতে ত্রুটি:', error.response?.data?.message || error.message);
      alert('টাস্ক স্থিতি আপডেট করতে ব্যর্থ হয়েছে।'); // কাস্টম মোডাল ব্যবহার করা উচিত
    }
  };

  const handleDelete = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই টাস্কটি মুছতে চান?')) {
      try {
        const res = await api.delete(`/projects/${projectId}/tasks/${task.id}`);
        if (res.status === 200) {
          onTaskDelete(task.id);
        }
      } catch (error) {
        console.error('টাস্ক মুছতে ত্রুটি:', error.response?.data?.message || error.message);
        alert('টাস্ক মুছতে ব্যর্থ হয়েছে। শুধুমাত্র প্রজেক্ট মালিক টাস্ক মুছতে পারবে।'); // কাস্টম মোডাল ব্যবহার করা উচিত
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'to-do':
        return 'bg-gray-200 text-gray-800';
      case 'processing':
        return 'bg-yellow-200 text-yellow-800';
      case 'done':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h4>
      <p className="text-gray-700 text-sm mb-3">{task.description || 'কোনো বর্ণনা নেই।'}</p>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <span>নিযুক্ত: <span className="font-medium text-blue-700">{task.assigned_to_username || 'অ-নিযুক্ত'}</span></span>
        {task.due_date && (
          <span>শেষ তারিখ: <span className="font-medium">{new Date(task.due_date).toLocaleDateString()}</span></span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`px-3 py-1 rounded-md font-medium capitalize focus:outline-none focus:ring-2 focus:ring-offset-2 ${getStatusColor(task.status)}`}
        >
          <option value="to-do">To Do</option>
          <option value="processing">Processing</option>
          <option value="done">Done</option>
        </select>
        {isOwner && ( // শুধুমাত্র প্রজেক্ট মালিক টাস্ক মুছতে পারবে
          <button
            onClick={handleDelete}
            className="ml-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            title="টাস্ক মুছুন"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zM9 13a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
