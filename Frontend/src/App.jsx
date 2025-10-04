import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MineMap from './components/MineMap';
import AlertCardModal from './components/AlertCardModal';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import AnalyticsTab from './components/AnalyticsTab';
import BatchRiskPredictor from './components/BatchRiskPredictor';
import { useAlertStore } from './store/alertStore';

function App() {
  const { activeAlert, setActiveAlert } = useAlertStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [analyticsView, setAnalyticsView] = useState('single'); // 'single' or 'batch'

  // Close alert modal
  const handleCloseAlert = () => {
    console.log('App.jsx: Closing alert modal');
    setActiveAlert(null);
  };

  // Handle successful login
  const handleLoginSuccess = (role) => {
    console.log(`App.jsx: Login successful for role: ${role}`);
    setShowLogin(false);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        onShowLogin={() => setShowLogin(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Only show on dashboard */}
        {currentScreen === 'dashboard' && isSidebarOpen && (
          <Sidebar onAlertClick={(alert) => setActiveAlert(alert)} />
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-auto">
          {/* Home Screen */}
          {currentScreen === 'home' && (
            <Home setCurrentScreen={setCurrentScreen} />
          )}

          {/* Dashboard Screen */}
          {currentScreen === 'dashboard' && <MineMap />}

          {/* Analytics Screen */}
          {currentScreen === 'analytics' && (
            <div className="h-full">
              {/* Analytics Tab Switcher */}
              <div className="bg-slate-900 border-b border-slate-700 p-4">
                <div className="max-w-7xl mx-auto flex items-center space-x-4">
                  <button
                    onClick={() => setAnalyticsView('single')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      analyticsView === 'single'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Single Prediction
                  </button>
                  <button
                    onClick={() => setAnalyticsView('batch')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      analyticsView === 'batch'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Batch Prediction
                  </button>
                </div>
              </div>

              {/* Analytics Content */}
              {analyticsView === 'single' ? (
                <AnalyticsTab />
              ) : (
                <BatchRiskPredictor />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Alert Modal */}
      {activeAlert && (
        <AlertCardModal
          alert={activeAlert}
          onClose={handleCloseAlert}
          onAlertAction={(action, alertId) => {
            console.log(`Action ${action} on alert ${alertId}`);
          }}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
