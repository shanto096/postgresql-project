import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import ProjectList from '../components/ProjectList';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectDetailPage from './ProjectDetailPage';
import UserDetailModal from '../components/UesrDetailModel';

const DashboardPage = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [projects, setProjects] = useState([]);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Error loading projects:', error.response?.data?.message || error.message);
        setErrorMessage('Failed to load projects.');
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
      setProjects([...projects, res.data.project]);
      setShowCreateProjectModal(false);
      alert('Project created successfully!');
      navigate(`/dashboard/${res.data.project.id}`);
    } catch (error) {
      console.error('Error creating project:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Failed to create project.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-[100vh] font-inter bg-gray-50">
      {/* Left Panel: Project List */}
      <div className="w-1/4 p-4 border-r border-gray-200 overflow-y-auto">
        {/* Avatar and username */}
        <div className="flex items-center mb-5">
          <button
            onClick={() => setUserModalOpen(true)}
            className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold border-2 border-blue-400 shadow hover:scale-110 transition-transform focus:outline-none mr-3"
            title="View user info"
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
            setErrorMessage('');
          }}
        />
      </div>

      {/* Right Panel: Project Details or Welcome Message */}
      <div className="w-3/4 overflow-y-auto">
        {projectId ? (
          <ProjectDetailPage projectId={projectId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <h2 className="text-3xl font-bold mb-4">Select or create a project</h2>
            <p className="text-lg text-center">Please select a project from the left or create a new one.</p>
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <CreateProjectModal
          onClose={() => setShowCreateProjectModal(false)}
          onCreate={handleCreateProject}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default DashboardPage;
