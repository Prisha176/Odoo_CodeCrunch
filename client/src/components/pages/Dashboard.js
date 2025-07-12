import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaMapMarkerAlt, FaStar, FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';
import Loading from '../layout/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkills, setShowSkills] = useState(true);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      const response = await axios.get('/api/swaps/my-swaps');
      setSwaps(response.data.slice(0, 5)); // Show only recent 5 swaps
    } catch (error) {
      toast.error('Failed to load swaps');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'badge-warning', text: 'Pending' },
      accepted: { class: 'badge-success', text: 'Accepted' },
      rejected: { class: 'badge-danger', text: 'Rejected' },
      cancelled: { class: 'badge-secondary', text: 'Cancelled' },
      completed: { class: 'badge-primary', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FaUser className="text-2xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user?.name}</h3>
                {user?.location && (
                  <p className="text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {user.location}
                  </p>
                )}
              </div>
            </div>

            {user?.rating && (
              <div className="mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-semibold">{user.rating.average.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({user.rating.count} ratings)</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Link to="/profile" className="btn btn-outline btn-sm flex-1">
                <FaEdit className="mr-1" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Skills Summary */}
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Skills Summary</h3>
              <button
                onClick={() => setShowSkills(!showSkills)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showSkills ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {showSkills && (
              <div>
                <div className="mb-4">
                  <h4 className="font-medium text-green-600 mb-2">Skills Offered ({user?.skillsOffered?.length || 0})</h4>
                  {user?.skillsOffered?.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex justify-between items-center mb-1">
                      <span className="text-sm">{skill.name}</span>
                      <span className="badge badge-success text-xs">{skill.level}</span>
                    </div>
                  ))}
                  {user?.skillsOffered?.length > 3 && (
                    <p className="text-sm text-gray-500">+{user.skillsOffered.length - 3} more</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Skills Wanted ({user?.skillsWanted?.length || 0})</h4>
                  {user?.skillsWanted?.slice(0, 3).map((skill, index) => (
                    <div key={index} className="flex justify-between items-center mb-1">
                      <span className="text-sm">{skill.name}</span>
                      <span className="badge badge-primary text-xs">{skill.level}</span>
                    </div>
                  ))}
                  {user?.skillsWanted?.length > 3 && (
                    <p className="text-sm text-gray-500">+{user.skillsWanted.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Swaps</h3>
              <Link to="/my-swaps" className="text-blue-600 hover:text-blue-500 text-sm">
                View All
              </Link>
            </div>

            {swaps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No swaps yet</p>
                <Link to="/search" className="btn btn-primary">
                  Find People to Swap With
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {swaps.map((swap) => (
                  <div key={swap._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">
                          {swap.requester._id === user._id ? (
                            <>You → {swap.recipient.name}</>
                          ) : (
                            <>{swap.requester.name} → You</>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {swap.requestedSkill.name} ↔ {swap.offeredSkill.name}
                        </p>
                      </div>
                      {getStatusBadge(swap.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/search" className="btn btn-primary">
                Search for Skills
              </Link>
              <Link to="/my-swaps" className="btn btn-outline">
                View My Swaps
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 