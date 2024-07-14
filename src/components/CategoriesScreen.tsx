// src/components/CategoriesScreen.tsx
import React from 'react';
import { FaStar, FaTasks, FaTrophy, FaArrowRight } from 'react-icons/fa';

const CategoriesScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-500 p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alexander Goode</h1>
          <p className="text-sm">Captain</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-full">
          <FaStar size={24} />
        </div>
      </div>

     

      
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <FaTasks size={24} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between mb-4">
          <div>
            <p className="text-sm">Invite a friend</p>
            <p className="text-xs">Inactive</p>
          </div>
          <div className="text-yellow-500">5000</div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;
