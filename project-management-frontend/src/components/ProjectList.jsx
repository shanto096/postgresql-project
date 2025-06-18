import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ProjectList = ({ projects, onCreateProjectClick, onProjectClick }) => {
  const { projectId: selectedProjectId } = useParams();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col">
      <div className="items-center mb-6">
        <button
          onClick={onCreateProjectClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-600 text-center py-4">You don't have any projects yet. Create one to get started!</p>
      ) : (
        <ul className="space-y-3 overflow-y-auto pr-2 flex-grow">
          {projects.map((project) => (
            <li key={project.id}>
              {onProjectClick ? (
                <button
                  type="button"
                  onClick={() => onProjectClick(project.id)}
                  className={`block w-full text-left p-4 rounded-lg shadow-sm transition-all duration-200
                    ${selectedProjectId === project.id ? 'bg-blue-100 border-blue-500 border-l-4' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{project.description || 'No description available.'}</p>
                </button>
              ) : (
                <Link
                  to={`/dashboard/${project.id}`}
                  className={`block p-4 rounded-lg shadow-sm transition-all duration-200
                    ${selectedProjectId === project.id ? 'bg-blue-100 border-blue-500 border-l-4' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{project.description || 'No description available.'}</p>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
