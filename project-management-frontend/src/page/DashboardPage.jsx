import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import ProjectList from '../components/projectList';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectDetailPage from './ProjectDetailPage';
import UserDetailModal from '../components/UesrDetailModel';

const DashboardPage = () => { 
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams(); // URL থেকে নির্বাচিত প্রজেক্টের আইডি পান

  const [projects, setProjects] = useState([]);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);

  // প্রমাণীকরণ অবস্থা চেক করুন
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // প্রজেক্ট লোড করুন
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('প্রজেক্ট লোড করতে ত্রুটি:', error.response?.data?.message || error.message);
        setErrorMessage('প্রজেক্ট লোড করতে ব্যর্থ হয়েছে।');
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleCreateProject = async (name, description) => {
    setErrorMessage('');
    try {
      const res = await api.post('/projects', { name, description });
      setProjects([...projects, res.data.project]); // নতুন প্রজেক্ট যোগ করুন
      setShowCreateProjectModal(false); // মডাল বন্ধ করুন
      alert('প্রজেক্ট সফলভাবে তৈরি হয়েছে!'); // কাস্টম মোডাল ব্যবহার করা উচিত
      navigate(`/dashboard/${res.data.project.id}`); // নতুন তৈরি করা প্রজেক্টে নেভিগেট করুন
    } catch (error) {
      console.error('প্রজেক্ট তৈরি করতে ত্রুটি:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'প্রজেক্ট তৈরি করতে ব্যর্থ হয়েছে।');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">লোড হচ্ছে...</div>;
  }

  if (!isAuthenticated) {
    return null; // রিডাইরেক্ট পরিচালনা করা হচ্ছে useEffect এ
  }

  return (
    <div className="flex h-[100vh] font-inter bg-gray-50"> {/* 80px হেডার উচ্চতা ধরে */}
      {/* বাম প্যানেল: প্রজেক্ট তালিকা */}
      <div className="w-1/4 p-4 border-r border-gray-200 overflow-y-auto">
        {/* Avatar and username at the top */}
        <div className="flex items-center mb-5">
          <button
            onClick={() => setUserModalOpen(true)}
            className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold border-2 border-blue-400 shadow hover:scale-110 transition-transform focus:outline-none mr-3"
            title="ব্যবহারকারীর তথ্য দেখুন"
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
          </button>
          <span className="text-xl font-bold text-black">{user?.username}</span>
        </div>
        <UserDetailModal open={userModalOpen} onClose={() => setUserModalOpen(false)} />
        <ProjectList
          projects={projects}
          onCreateProjectClick={() => {
            setShowCreateProjectModal(true);
            setErrorMessage(''); // মডাল খোলার সময় আগের ত্রুটি সাফ করুন
          }}
        />
      </div>

      {/* ডান প্যানেল: প্রজেক্ট বিস্তারিত বা স্বাগত বার্তা */}
      <div className="w-3/4  overflow-y-auto">
        {projectId ? (
          <ProjectDetailPage projectId={projectId} /> // যদি প্রজেক্ট আইডি থাকে, তবে সেই প্রজেক্টের বিস্তারিত দেখান
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <h2 className="text-3xl font-bold mb-4">একটি প্রজেক্ট নির্বাচন করুন বা নতুন প্রজেক্ট তৈরি করুন   </h2>
            <p className="text-lg text-center">বাম পাশ থেকে একটি প্রজেক্ট নির্বাচন করুন অথবা একটি নতুন প্রজেক্ট তৈরি করুন।</p>
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              নতুন প্রজেক্ট তৈরি করুন
            </button>
          </div>
        )}
      </div>

      {/* প্রজেক্ট তৈরির মডাল */}
      {showCreateProjectModal && (
        <CreateProjectModal
          onClose={() => setShowCreateProjectModal(false)}
          onCreate={handleCreateProject}
          errorMessage={errorMessage} // মডালে ত্রুটি বার্তা পাঠান
        />
      )}
    </div>
  );
};

export default DashboardPage;
