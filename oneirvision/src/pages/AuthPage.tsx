import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from '../components/LoginButton';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

// Create typed icon components
const FiHome = FiIcons.FiHome as React.ComponentType<{ className?: string }>;

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-dark-bg to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-deep-purple/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-vivid-blue/20 rounded-full filter blur-3xl"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-dark-secondary/80 to-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Welcome to OneirVision
                </h1>
                <p className="text-gray-400">
                  Sign in to continue to your dream journey.
                </p>
              </div>

              <div className="mt-6">
                <LoginButton />
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <FiHome className="mr-2" />
                  Back to Home
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;