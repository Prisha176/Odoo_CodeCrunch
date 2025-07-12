import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { id } = useParams();

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">View user profile and skills</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <p className="text-gray-600">
          This page will display the profile of user with ID: {id}
        </p>
        <p className="text-gray-600 mt-2">
          You'll be able to view their skills, ratings, and send swap requests.
        </p>
      </div>
    </div>
  );
};

export default UserProfile; 