import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import ProjectDetailModal from '../components/ProjectDetailModal';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState('');

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addTaskLoading, setAddTaskLoading] = useState(false);
  const [addTaskError, setAddTaskError] = useState('');

  const isOwner = project && user?.id === project.owner_id;

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId || !isAuthenticated) {
        setProject(null);
        setMembers([]);
        setTasks([]);
        setLoadingProject(false);
        return;
      }

      try {
        setLoadingProject(true);
        setError('');

        const projectRes = await api.get(`/projects/${projectId}`);
        setProject(projectRes.data);

        const membersRes = await api.get(`/projects/${projectId}/members`);
        setMembers(membersRes.data);

        const tasksRes = await api.get(`/projects/${projectId}/tasks`);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error('Error loading project data:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to load project data.');
        setProject(null);
        setMembers([]);
        setTasks([]);
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProjectData();
  }, [projectId, isAuthenticated]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post(`/projects/${projectId}/members`, {
        email: newMemberEmail,
        role: newMemberRole,
      });
      alert(res.data.message);
      const membersRes = await api.get(`/projects/${projectId}/members`);
      setMembers(membersRes.data);
      setNewMemberEmail('');
      setNewMemberRole('member');
    } catch (err) {
      console.error('Error adding member:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (memberIdToRemove) => {
    setError('');
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const res = await api.delete(`/projects/${projectId}/members/${memberIdToRemove}`);
        alert(res.data.message);
        setMembers(members.filter((member) => member.id !== memberIdToRemove));
      } catch (err) {
        console.error('Error removing member:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to remove member.');
      }
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks(tasks.filter((task) => task.id !== deletedTaskId));
  };

  const handleAddTaskModalCreate = async ({ title, description, assignedTo, dueDate }) => {
    setAddTaskLoading(true);
    setAddTaskError('');
    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      });
      const tasksRes = await api.get(`/projects/${projectId}/tasks`);
      setTasks(tasksRes.data);
      setAddTaskModalOpen(false);
    } catch (err) {
      setAddTaskError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setAddTaskLoading(false);
    }
  };

  if (loadingProject) {
    return <div className="flex justify-center items-center h-full text-xl font-semibold">Loading project...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-600 text-xl font-semibold">{error}</div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center h-full text-gray-600 text-xl font-semibold">Project data not found.</div>;
  }

  const tasksToDo = tasks.filter((task) => task.status === 'to-do');
  const tasksProcessing = tasks.filter((task) => task.status === 'processing');
  const tasksDone = tasks.filter((task) => task.status === 'done');

  return (
    <>
      <div className="fixed w-full bg-gradient-to-r from-blue-100  to-indigo-700 text-white p-1 px-5 shadow-lg ">
        <h1 onClick={() => setModalOpen(true)} className="text-4xl capitalize font-extrabold text-gray-900 mb-4 py-1">
          {project.name}
        </h1>
      </div>

      <div className="font-inter bg-gray-50 h-full">
        {/* Task Board */}
        <div className="grid grid-cols-1 mt-20 p-4 md:grid-cols-3 gap-6">
          {/* To Do */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-800 text-center">To Do ({tasksToDo.length})</h2>
              <button
                className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all duration-200"
                onClick={() => setAddTaskModalOpen(true)}
              >
                + Add Task
              </button>
            </div>
            {tasksToDo.length === 0 ? (
              <p className="text-gray-600 text-center">No tasks in To Do.</p>
            ) : (
              tasksToDo.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  projectOwnerId={project.owner_id}
                />
              ))
            )}
          </div>

          {/* Processing */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6 text-center">Processing ({tasksProcessing.length})</h2>
            {tasksProcessing.length === 0 ? (
              <p className="text-gray-600 text-center">No tasks in Processing.</p>
            ) : (
              tasksProcessing.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  projectOwnerId={project.owner_id}
                />
              ))
            )}
          </div>

          {/* Done */}
          <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-300">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Done ({tasksDone.length})</h2>
            {tasksDone.length === 0 ? (
              <p className="text-gray-600 text-center">No tasks in Done.</p>
            ) : (
              tasksDone.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                  projectOwnerId={project.owner_id}
                />
              ))
            )}
          </div>
        </div>

        <AddTaskModal
          open={addTaskModalOpen}
          onClose={() => { setAddTaskModalOpen(false); setAddTaskError(''); }}
          onCreate={handleAddTaskModalCreate}
          members={members}
          loading={addTaskLoading}
          error={addTaskError}
        />
      </div>

      <ProjectDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        members={members}
        isOwner={isOwner}
        handleRemoveMember={handleRemoveMember}
        handleAddMember={handleAddMember}
        newMemberEmail={newMemberEmail}
        setNewMemberEmail={setNewMemberEmail}
        newMemberRole={newMemberRole}
        setNewMemberRole={setNewMemberRole}
        project={project}
        errorMessage={error}
      />
    </>
  );
};

export default ProjectDetailPage;
