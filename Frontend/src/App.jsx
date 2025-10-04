import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MineMap from './components/MineMap';
import AlertCardModal from './components/AlertCardModal';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import { useAlertStore } from './store/alertStore';

function App() {
  const { activeAlert, setActiveAlert } = useAlertStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showLogin, setShowLogin] = useState(false);

  // Handle close alert
  const handleCloseAlert = () => {
    console.log('App.jsx: Closing alert modal');
    setActiveAlert(null);
  };

  // Handle login success
  const handleLoginSuccess = () => {
    console.log('Login successful');
    setShowLogin(false);
    setCurrentScreen('dashboard');
    // Reload page to fetch data with new token
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        onShowLogin={() => {
          console.log('Opening login modal');
          setShowLogin(true);
        }}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Only show on dashboard */}
        {currentScreen === 'dashboard' && isSidebarOpen && (
          <Sidebar onAlertClick={(alert) => setActiveAlert(alert)} />
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-auto">
          {currentScreen === 'home' && (
            <Home setCurrentScreen={setCurrentScreen} />
          )}
          {currentScreen === 'dashboard' && <MineMap />}
          {currentScreen === 'analytics' && (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 text-xl">Analytics View (Coming Soon)</p>
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

      {/* Login Modal - MUST BE RENDERED */}
      {showLogin && (
        <LoginPage
          onClose={() => {
            console.log('Closing login modal');
            setShowLogin(false);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
