// src/components/SplashScreen.tsx
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center">
      <div className="text-center">
        <div className="bg-black p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-purple-400 animate-bounce">STORGES</h1>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
