import React, { useState } from 'react';

const CreateProjectModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('প্রজেক্টের নাম আবশ্যক।');
      return;
    }
    onCreate(name, description);
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative transform scale-95 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">নতুন প্রজেক্ট তৈরি করুন</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-gray-700 text-sm font-semibold mb-2">
              প্রজেক্টের নাম:
            </label>
            <input
              type="text"
              id="projectName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="উদাহরণ: ওয়েবসাইট ডেভেলপমেন্ট"
              required
            />
          </div>
          <div>
            <label htmlFor="projectDescription" className="block text-gray-700 text-sm font-semibold mb-2">
              বর্ণনা (ঐচ্ছিক):
            </label>
            <textarea
              id="projectDescription"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="এই প্রজেক্টটি কী সম্পর্কে?"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            প্রজেক্ট তৈরি করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
