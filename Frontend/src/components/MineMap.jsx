import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSatelliteDish, FaUpload, FaChartBar, FaSync, FaTrash } from 'react-icons/fa';
import { useAlertStore } from '../store/alertStore';
import CSVUpload from './CSVUpload';
import ClearDataModal from './ClearDataModal';
import api from '../services/api';

const MineMap = () => {
  const { alerts, setActiveAlert } = useAlertStore();
  const [showUpload, setShowUpload] = useState(false);
  const [showClearData, setShowClearData] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [stats, setStats] = useState({
    total_sensors: 0,
    total_readings: 0,
    rockfall_events: 0,
    high_risk_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchStatistics(),
        fetchSensors(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/sensors/statistics/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchSensors = async () => {
    try {
      const response = await api.get('/sensors/');
      setSensors(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching sensors:', error);
    }
  };

const handleUploadSuccess = (result) => {
  console.log('✅ Upload successful:', result);
  alert(`Successfully uploaded ${result.created} sensor readings!`);
  
  // Refresh all data including alerts
  fetchAllData();
  
  // Trigger alert store refresh
  const { fetchAlerts } = useAlertStore.getState();
  fetchAlerts();
};


  const handleDataCleared = () => {
    console.log('✅ Data cleared');
    fetchAllData();
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const getSeverityFromScore = (score) => {
    if (score >= 90) return 'CRITICAL';
    if (score >= 75) return 'HIGH';
    if (score >= 50) return 'MODERATE';
    return 'LOW';
  };

  const getRiskColorClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-600';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MODERATE':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskGlowClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'shadow-lg shadow-red-500/50 animate-pulse';
      case 'HIGH':
        return 'shadow-lg shadow-orange-500/50';
      case 'MODERATE':
        return 'shadow-md shadow-yellow-500/30';
      default:
        return '';
    }
  };

  return (
    <div className="h-full bg-slate-950 overflow-auto">
      {/* Statistics Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Dashboard Statistics</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaSync className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              {/* Only show Clear Data button to Admins */}
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => setShowClearData(true)}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaTrash />
                  <span>Clear Data</span>
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Sensors</p>
                  <p className="text-2xl font-bold text-white">{stats.total_sensors}</p>
                </div>
                <FaSatelliteDish className="text-blue-400 text-3xl" />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Readings</p>
                  <p className="text-2xl font-bold text-white">{stats.total_readings}</p>
                </div>
                <FaChartBar className="text-green-400 text-3xl" />
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Rockfall Events</p>
                  <p className="text-2xl font-bold text-white">{stats.rockfall_events}</p>
                </div>
                <div className="text-yellow-400 text-3xl">⚠️</div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">High Risk</p>
                  <p className="text-2xl font-bold text-red-400">{stats.high_risk_count}</p>
                </div>
                <div className="text-red-400 text-3xl">🔴</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>3D Mine Topography</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Interactive mine visualization with sensor locations
              </p>
            </div>
          </div>

          {/* Mine Map Image Display */}
          <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
            <img
              src="/mine-map.jpg"
              alt="Mine Topography"
              className="w-full h-auto min-h-[600px] object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            
            <div 
              className="w-full min-h-[600px] hidden items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900"
            >
              <div className="text-center">
                <FaMapMarkerAlt className="text-slate-600 text-6xl mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Mine Topography Map</p>
                <p className="text-slate-600 text-sm mt-2">
                  Place your mine image at: public/mine-map.jpg
                </p>
              </div>
            </div>

            {/* Overlay sensor markers on image */}
            {sensors.slice(0, 10).map((sensor, index) => {
              const severity = getSeverityFromScore(parseFloat(sensor.rockfall_risk_score));
              return (
                <div
                  key={sensor.id}
                  className={`absolute ${getRiskColorClass(severity)} ${getRiskGlowClass(severity)} rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-125 transition-transform`}
                  style={{
                    top: `${20 + (index * 8) % 60}%`,
                    left: `${20 + (index * 12) % 60}%`,
                  }}
                  title={`${sensor.sensor_id} - Risk: ${sensor.rockfall_risk_score}`}
                >
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-slate-400 text-sm">Critical (90+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">High (75-90)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">Moderate (50-75)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-slate-400 text-sm">Low (&lt;50)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Upload Button */}
      <button
        onClick={() => setShowUpload(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 transition-all hover:shadow-2xl hover:scale-105 z-40"
      >
        <FaUpload size={20} />
        <span className="font-semibold">Upload CSV</span>
      </button>

      {/* Modals */}
      {showUpload && (
        <CSVUpload
          onClose={() => setShowUpload(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {showClearData && (
        <ClearDataModal
          onClose={() => setShowClearData(false)}
          onDataCleared={handleDataCleared}
        />
      )}
    </div>
  );
};

export default MineMap;
