import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaCog, FaChartLine, FaTachometerAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';

const Header = ({
  onToggleSidebar,
  currentScreen,
  setCurrentScreen,
  onShowLogin,
}) => {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-slate-400 hover:text-white transition-colors lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={20} />
        </button>

        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FaTachometerAlt className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">StrataNet AI</h1>
            <p className="text-xs text-slate-400">Geotechnical Monitoring System</p>
          </div>
        </div>
      </div>

      {/* Center Section - LARGER Navigation Buttons */}
      <nav className="hidden md:flex items-center space-x-3">
        <button
          onClick={() => setCurrentScreen('home')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all text-base font-semibold ${
            currentScreen === 'home'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <FaHome size={20} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentScreen('dashboard')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all text-base font-semibold ${
            currentScreen === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <FaTachometerAlt size={20} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentScreen('analytics')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all text-base font-semibold ${
            currentScreen === 'analytics'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <FaChartLine size={20} />
          <span>Analytics</span>
        </button>
      </nav>

      {/* Right Section - User Profile Only */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <FaBell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            0
          </span>
        </button>

        {/* User Profile */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"
            >
              <FaUserCircle className="text-blue-400" size={28} />
              <div className="text-left">
                <p className="text-white text-sm font-medium">
                  {user.first_name || user.username}
                </p>
                <p className="text-slate-400 text-xs">{user.role}</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    {user.role}
                  </span>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <FaCog />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onShowLogin}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <FaUserCircle size={20} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
