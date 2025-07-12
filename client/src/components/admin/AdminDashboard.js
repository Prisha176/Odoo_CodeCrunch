import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform administration and management</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Administration Panel</h2>
        <p className="text-gray-600">
          This page will provide admin tools for user management, content moderation, and platform analytics.
        </p>
        <p className="text-gray-600 mt-2">
          Features will include user banning, role management, and detailed reports.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard; 