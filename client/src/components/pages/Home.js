import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaExchangeAlt, FaUsers, FaStar, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Swap Skills, Grow Together
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with people who have the skills you need and offer your expertise in return. 
              Build meaningful relationships while learning and teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link to="/search" className="btn btn-outline btn-lg">
                    Browse Skills
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    Go to Dashboard
                  </Link>
                  <Link to="/search" className="btn btn-outline btn-lg">
                    Find Skills
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Skill Swap?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FaExchangeAlt className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Skill Exchange</h3>
              <p className="text-gray-600">
                Offer your expertise and receive help with skills you want to learn. 
                It's a win-win for everyone involved.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FaUsers className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your passion for learning 
                and personal growth.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FaStar className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p className="text-gray-600">
                Our rating system ensures you connect with reliable and skilled individuals 
                for the best learning experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and list the skills you can offer and what you want to learn.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Find Matches</h3>
              <p className="text-gray-600">
                Search for people with the skills you need and who want your expertise.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Make Request</h3>
              <p className="text-gray-600">
                Send a swap request with details about what you want to exchange.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn & Grow</h3>
              <p className="text-gray-600">
                Meet up, exchange skills, and rate each other after the swap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Swapping Skills?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of people who are already learning and teaching through skill swaps.
            </p>
            {!isAuthenticated ? (
              <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 btn-lg">
                Join Now - It's Free!
              </Link>
            ) : (
              <Link to="/search" className="btn bg-white text-blue-600 hover:bg-gray-100 btn-lg">
                Find Your Next Swap
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 