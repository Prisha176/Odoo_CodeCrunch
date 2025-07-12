import React from 'react';

const MySwaps = () => {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
        <p className="text-gray-600">Manage your skill swap requests</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Swap Management</h2>
        <p className="text-gray-600">
          This page will show all your swap requests - pending, accepted, and completed.
        </p>
        <p className="text-gray-600 mt-2">
          You'll be able to accept, reject, cancel, and rate swaps here.
        </p>
      </div>
    </div>
  );
};

export default MySwaps; 