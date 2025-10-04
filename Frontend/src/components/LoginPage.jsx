import React, { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaUserShield } from 'react-icons/fa';
import api from '../services/api';

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'ADMIN'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', formData);
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Call success handler
      if (onLoginSuccess) {
        onLoginSuccess(response.data.user.role);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border-2 border-blue-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Login to StrataNet AI</h2>
              <p className="text-blue-100 text-sm">Geotechnical Monitoring System</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              <FaUser className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@stratanet.ai"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Role Selection - Only Admin & Manager */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              <FaUserShield className="inline mr-2" />
              User Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ADMIN"> Administrator</option>
              <option value="MANAGER"> Manager</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* Demo Credentials */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-300 text-sm font-semibold mb-3">Demo Credentials:</p>
            <div className="space-y-3">
              {/* Admin */}
              <div className="bg-slate-900 rounded p-3">
                <p className="text-blue-400 font-semibold text-xs mb-2">👑 Administrator</p>
                <div className="text-slate-300 text-xs space-y-1">
                  <p>📧 <span className="text-blue-300">admin@stratanet.ai</span></p>
                  <p>🔑 <span className="text-blue-300">password</span></p>
                </div>
              </div>
              
              {/* Manager */}
              <div className="bg-slate-900 rounded p-3">
                <p className="text-purple-400 font-semibold text-xs mb-2">👔 Manager</p>
                <div className="text-slate-300 text-xs space-y-1">
                  <p>📧 <span className="text-purple-300">manager@stratanet.ai</span></p>
                  <p>🔑 <span className="text-purple-300">password</span></p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
