import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // navigate আর প্রয়োজন নেই, কারণ এটি DashboardPage থেকে লোড হচ্ছে
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';  
import AddTaskModal from '../components/AddTaskModal';
import ProjectDetailModal from '../components/ProjectDetailModal';

const ProjectDetailPage = () => {
  const { projectId } = useParams(); // URL থেকে নির্বাচিত প্রজেক্টের আইডি পান
  const { isAuthenticated, user } = useAuth(); // loading এখন DashboardPage থেকে হ্যান্ডেল করা হয়
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

  // প্রজেক্ট ডেটা লোড করুন যখন projectId বা প্রমাণীকরণ অবস্থা পরিবর্তন হয়
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
        setError(''); // নতুন প্রজেক্ট লোড করার আগে ত্রুটি সাফ করুন

        const projectRes = await api.get(`/projects/${projectId}`);
        setProject(projectRes.data);

        const membersRes = await api.get(`/projects/${projectId}/members`);
        setMembers(membersRes.data);

        const tasksRes = await api.get(`/projects/${projectId}/tasks`);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error('প্রজেক্ট ডেটা লোড করতে ত্রুটি:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'প্রজেক্ট ডেটা লোড করতে ব্যর্থ হয়েছে।');
        setProject(null); // ত্রুটি হলে প্রজেক্ট ডেটা সাফ করুন
        setMembers([]);
        setTasks([]);
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProjectData();
  }, [projectId, isAuthenticated]); // projectId এবং isAuthenticated এর উপর নির্ভর করে

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post(`/projects/${projectId}/members`, {
        email: newMemberEmail,
        role: newMemberRole,
      });
      alert(res.data.message);
      // নতুন সদস্যের ডেটা সহ সদস্যদের তালিকা পুনরায় লোড করুন
      const membersRes = await api.get(`/projects/${projectId}/members`);
      setMembers(membersRes.data);
      setNewMemberEmail('');
      setNewMemberRole('member');
    } catch (err) {
      console.error('সদস্য যোগ করতে ত্রুটি:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'সদস্য যোগ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleRemoveMember = async (memberIdToRemove) => {
    setError('');
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই সদস্যকে সরাতে চান?')) {
      try {
        const res = await api.delete(`/projects/${projectId}/members/${memberIdToRemove}`);
        alert(res.data.message);
        setMembers(members.filter((member) => member.id !== memberIdToRemove));
      } catch (err) {
        console.error('সদস্য সরাতে ত্রুটি:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'সদস্য সরাতে ব্যর্থ হয়েছে।');
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
      // Refresh tasks
      const tasksRes = await api.get(`/projects/${projectId}/tasks`);
      setTasks(tasksRes.data);
      setAddTaskModalOpen(false);
    } catch (err) {
      setAddTaskError(err.response?.data?.message || 'টাস্ক তৈরি করতে ব্যর্থ হয়েছে।');
    } finally {
      setAddTaskLoading(false);
    }
  };

  if (loadingProject) {
    return <div className="flex justify-center items-center h-full text-xl font-semibold">প্রজেক্ট লোড হচ্ছে...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-600 text-xl font-semibold">{error}</div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center h-full text-gray-600 text-xl font-semibold">প্রজেক্ট ডেটা পাওয়া যায়নি।</div>;
  }

  const tasksToDo = tasks.filter((task) => task.status === 'to-do');
  const tasksProcessing = tasks.filter((task) => task.status === 'processing');
  const tasksDone = tasks.filter((task) => task.status === 'done');

  return (
    <>
    <div className='fixed w-full  bg-blue-500'>   
    <h1 onClick={() => setModalOpen(true)  } className="text-4xl capitalize font-extrabold text-gray-900 mb-4 py-1 ">{project.name}</h1>
    
    </div>
    <div className="font-inter bg-gray-50 h-full"> {/* h-full যোগ করা হয়েছে */}
     

      

      {/* টাস্ক বোর্ড */}
      <div className="grid grid-cols-1 mt-20 p-4 md:grid-cols-3 gap-6">
        {/* To Do কলাম */}
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
            <p className="text-gray-600 text-center">কোনো To Do টাস্ক নেই।</p>
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

        {/* Processing কলাম */}
        <div className="bg-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-800 mb-6 text-center">Processing ({tasksProcessing.length})</h2>
          {tasksProcessing.length === 0 ? (
            <p className="text-gray-600 text-center">কোনো Processing টাস্ক নেই।</p>
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

        {/* Done কলাম */}
        <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-300">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Done ({tasksDone.length})</h2>
          {tasksDone.length === 0 ? (
            <p className="text-gray-600 text-center">কোনো Done টাস্ক নেই।</p>
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
      />
    </>
  );
};

export default ProjectDetailPage;
