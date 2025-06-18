import React from 'react';
// ProjectDetailPage থেকে props গ্রহণ করুন

const ProjectDetailModal = ({ open, onClose, members, isOwner, handleRemoveMember, handleAddMember, newMemberEmail, setNewMemberEmail, newMemberRole, setNewMemberRole, project, errorMessage }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative transform scale-95 animate-fade-in-up border border-blue-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-transform transform hover:rotate-90"
        >
          &times;
        </button>

        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">সদস্য ব্যবস্থাপনা</h2>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">
            <strong className="font-bold">ত্রুটি!</strong>
            <span className="block sm:inline ml-2">{errorMessage}</span>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">বর্তমান সদস্যগণ:</h3>
          {members.length === 0 ? (
            <p className="text-gray-600 text-center">এই প্রজেক্টে কোনো সদস্য নেই।</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-xl shadow-sm border border-gray-200">
                  <span className="font-medium text-gray-800">{member.username} (<span className="text-sm text-gray-600 capitalize">{member.role}</span>)</span>
                  {isOwner && member.id !== project.owner_id && ( // মালিক নিজেকে সরাতে পারবে না
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="ml-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                      title="সদস্য সরান"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zM9 13a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {isOwner && ( // শুধুমাত্র মালিক সদস্য যোগ করতে পারবে
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">নতুন সদস্য যোগ করুন:</h3>
            <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="সদস্যের ইমেল"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="member">সদস্য</option>
                <option value="admin">অ্যাডমিন</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                সদস্য যোগ করুন
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailModal;
