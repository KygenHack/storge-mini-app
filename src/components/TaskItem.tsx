import React from 'react';

interface TaskItemProps {
  title: string;
  progress?: string;
  points: number;
  description: string;
  isCompleted: boolean;
  onClick: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, progress, points, description, isCompleted, onClick }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center w-full">
    <div className="flex-grow">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      {progress && <p className="text-sm text-gray-600">{progress}</p>}
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm text-green-600">+ {points} STG</p>
    </div>
    <button
      onClick={onClick}
      className={`ml-4 ${isCompleted ? "bg-green-600" : "bg-yellow-500"} text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300`}
    >
      {isCompleted ? "Claim" : "Start"}
    </button>
  </div>
);

export default TaskItem;
