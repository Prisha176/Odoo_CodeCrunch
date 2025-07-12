import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaMapMarkerAlt, FaStar, FaUser } from 'react-icons/fa';
import Loading from '../layout/Loading';

const SearchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim() && !location.trim()) {
      toast.error('Please enter a skill or location to search');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('skill', searchTerm.trim());
      if (location.trim()) params.append('location', location.trim());

      const response = await axios.get(`/api/users/search?${params}`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLocation('');
    setUsers([]);
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Users</h1>
        <p className="text-gray-600">Find people with the skills you want to learn</p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="skill" className="form-label">Skill</label>
              <div className="relative">
                <input
                  type="text"
                  id="skill"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                  placeholder="e.g., JavaScript, Cooking, Guitar"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input pl-10"
                  placeholder="e.g., New York, London"
                />
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="form-group flex items-end">
              <div className="flex gap-2 w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="btn btn-outline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <Loading />
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    {user.location && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        {user.location}
                      </p>
                    )}
                  </div>
                </div>
                {user.rating && (
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{user.rating.average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-green-600 mb-2">Skills Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="badge badge-success text-xs">
                      {skill.name}
                    </span>
                  ))}
                  {user.skillsOffered?.length > 3 && (
                    <span className="text-xs text-gray-500">+{user.skillsOffered.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-blue-600 mb-2">Skills Wanted</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="badge badge-primary text-xs">
                      {skill.name}
                    </span>
                  ))}
                  {user.skillsWanted?.length > 3 && (
                    <span className="text-xs text-gray-500">+{user.skillsWanted.length - 3} more</span>
                  )}
                </div>
              </div>

              <Link
                to={`/user/${user._id}`}
                className="btn btn-primary btn-sm w-full"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      ) : searchTerm || location ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No users found matching your search criteria</p>
          <button
            onClick={clearSearch}
            className="btn btn-outline"
          >
            Try Different Search
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Enter a skill or location to start searching</p>
        </div>
      )}
    </div>
  );
};

export default SearchUsers; 