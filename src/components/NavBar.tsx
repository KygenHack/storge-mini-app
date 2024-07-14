// src/components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around p-1">
      <NavLink
        to="/home"
        className={({ isActive }) => 
          `flex flex-col items-center text-gray-600 text-sm ${isActive ? 'text-primary' : ''}`
        }
      >
        <i className="fas fa-home text-2xl"></i>
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) => 
          `flex flex-col items-center text-gray-600 text-sm ${isActive ? 'text-primary' : ''}`
        }
      >
        <i className="fas fa-tasks text-2xl"></i>
        <span>Tasks</span>
      </NavLink>
      <NavLink
        to="/frens"
        className={({ isActive }) => 
          `flex flex-col items-center text-gray-600 text-sm ${isActive ? 'text-primary' : ''}`
        }
      >
        <i className="fas fa-user-friends text-2xl"></i>
        <span>Frens</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
