import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your profile and skills</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
        <p className="text-gray-600">
          This page will allow you to edit your profile, manage your skills, and update your preferences.
        </p>
        <p className="text-gray-600 mt-2">
          Current user: {user?.name}
        </p>
      </div>
    </div>
  );
};

export default Profile; 