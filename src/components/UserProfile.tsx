// src/components/UserProfile.tsx
import React from 'react';
import { User } from '../types'; // Adjust the import path as needed

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Language Code:</strong> {user.languageCode}</p>
      <p><strong>Is Premium:</strong> {user.isPremium ? 'Yes' : 'No'}</p>
      <p><strong>Allows Write to PM:</strong> {user.allowsWriteToPm ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default UserProfile;
