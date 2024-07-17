import React from 'react';

interface TaskItemProps {
  title: string;
  progress?: string;
  points: string;
  buttonText: string;
  onClick: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, progress, points, buttonText, onClick }) => (
  <div className="bg-white text-black p-4 rounded-lg flex justify-between items-center shadow-md">
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      {progress && <p className="text-gray-400 text-sm">{progress}</p>}
      <p className="text-yellow-500 text-xs">{points}</p>
    </div>
    <button onClick={onClick} className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300">
      {buttonText}
    </button>
  </div>
);

export default TaskItem;
