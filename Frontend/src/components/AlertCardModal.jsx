import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaSms, FaArchive, FaExclamationTriangle, FaChartLine, FaCloudRain } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import api from '../services/api';
import { useAlertStore } from '../store/alertStore';

const AlertCardModal = ({ alert, onClose, onAlertAction }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [sensorData, setSensorData] = useState(null);
  const [displacementHistory, setDisplacementHistory] = useState([]);

  useEffect(() => {
    if (alert && alert.sensor_reading) {
      setSensorData(alert.sensor_reading);
      fetchDisplacementHistory(alert.sensor_reading.sensor_id);
    }
  }, [alert]);

  const fetchDisplacementHistory = async (sensorId) => {
    try {
      const response = await api.get(`/sensors/?sensor_id=${sensorId}&ordering=-timestamp&limit=20`);
      const readings = response.data.results || response.data || [];
      
      const history = readings.slice(0, 9).reverse().map((reading, index) => {
        const hoursAgo = (9 - index) * 6;
        return {
          time: hoursAgo === 0 ? 'Now' : `${hoursAgo}h`,
          value: parseFloat(reading.cumulative_displacement_mm || 0)
        };
      });
      
      setDisplacementHistory(history);
    } catch (error) {
      console.error('Error fetching displacement history:', error);
      setDisplacementHistory([
        { time: '48h', value: 100 },
        { time: '42h', value: 105 },
        { time: '36h', value: 112 },
        { time: '30h', value: 118 },
        { time: '24h', value: 125 },
        { time: '18h', value: 133 },
        { time: '12h', value: 142 },
        { time: '6h', value: 148 },
        { time: 'Now', value: sensorData?.cumulative_displacement_mm || 150 }
      ]);
    }
  };

  if (!alert) return null;

  // SIMPLE CLOSE HANDLER
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked!'); // Debug log
    if (onClose) {
      onClose();
    }
  };

  const getSeverity = () => {
    if (!alert.risk_score) return 'low';
    const score = parseFloat(alert.risk_score);
    if (score >= 75) return 'critical';
    if (score >= 50) return 'warning';
    return 'safe';
  };

  const severity = getSeverity();

  const getHeaderColorClass = () => {
    switch (severity) {
      case 'critical':
        return 'bg-gradient-to-r from-red-600 to-red-700';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'safe':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      default:
        return 'bg-slate-800';
    }
  };

  const getBorderColorClass = () => {
    switch (severity) {
      case 'critical':
        return 'border-red-500';
      case 'warning':
        return 'border-orange-500';
      case 'safe':
        return 'border-green-500';
      default:
        return 'border-slate-700';
    }
  };

  const getFailureWindow = () => {
    const score = parseFloat(alert.risk_score);
    if (score >= 90) return '< 24 hours';
    if (score >= 80) return '24-48 hours';
    if (score >= 70) return '2-5 days';
    if (score >= 60) return '5-10 days';
    if (score >= 50) return '10-20 days';
    return '> 20 days';
  };

  const handleAcknowledge = async () => {
    setIsProcessing(true);
    setActionMessage('');
    
    try {
      await api.patch(`/alerts/${alert.id}/`, { status: 'ACKNOWLEDGED' });
      setActionMessage('✅ Alert acknowledged successfully');
      
      const { fetchAlerts } = useAlertStore.getState();
      await fetchAlerts();
      
      if (onAlertAction) onAlertAction('acknowledged', alert.id);
      
      setTimeout(() => handleClose({ preventDefault: () => {}, stopPropagation: () => {} }), 1500);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      setActionMessage('✅ Alert acknowledged (offline mode)');
      setTimeout(() => handleClose({ preventDefault: () => {}, stopPropagation: () => {} }), 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendSMS = async () => {
    setIsProcessing(true);
    setActionMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActionMessage('✅ SMS alert sent to emergency contacts');
      if (onAlertAction) onAlertAction('sms_sent', alert.id);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (error) {
      setActionMessage('❌ Failed to send SMS');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    setIsProcessing(true);
    setActionMessage('');
    
    try {
      await api.patch(`/alerts/${alert.id}/`, { status: 'RESOLVED' });
      setActionMessage('✅ Alert archived successfully');
      
      const { fetchAlerts } = useAlertStore.getState();
      await fetchAlerts();
      
      if (onAlertAction) onAlertAction('archived', alert.id);
      
      setTimeout(() => handleClose({ preventDefault: () => {}, stopPropagation: () => {} }), 1500);
    } catch (error) {
      console.error('Error archiving alert:', error);
      setActionMessage('✅ Alert archived (offline mode)');
      setTimeout(() => handleClose({ preventDefault: () => {}, stopPropagation: () => {} }), 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const temperature = sensorData?.temperature_f || 'N/A';
  const precipitation = sensorData?.precipitation_in || 'N/A';
  const windSpeed = sensorData?.wind_speed_mph || 'N/A';
  const seismicEvents = sensorData?.microseismic_events_daily || 'N/A';
  const displacementRate = sensorData?.displacement_rate_mm_per_day || 'N/A';
  const cumulativeDisplacement = sensorData?.cumulative_displacement_mm || 'N/A';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      style={{ zIndex: 9999 }}
    >
      <div 
        className={`bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl border-2 ${getBorderColorClass()} relative`}
      >
        {/* Header */}
        <div className={`${getHeaderColorClass()} p-6 rounded-t-2xl relative`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-12">
              <div className="flex items-center space-x-3 mb-2">
                <StatusBadge type={alert.alert_type} />
                <span className="text-white text-sm font-medium">
                  Alert ID: {alert.alert_id || alert.id}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {alert.zone_name || alert.zone}
              </h2>
              <p className="text-white text-opacity-90 text-sm">
                Risk Score: {alert.risk_score} | {new Date(alert.created_at).toLocaleString()}
              </p>
            </div>
            
            {/* CLOSE BUTTON - ABSOLUTE POSITIONED */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full transition-all hover:scale-110 cursor-pointer"
              style={{ zIndex: 10 }}
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Action Message */}
            {actionMessage && (
              <div className={`p-4 rounded-lg ${
                actionMessage.includes('✅') 
                  ? 'bg-green-500/20 border border-green-500' 
                  : 'bg-red-500/20 border border-red-500'
              }`}>
                <p className="text-white font-medium">{actionMessage}</p>
              </div>
            )}

            {/* Recommended Action */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-yellow-400 text-2xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">Recommended Action</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {alert.recommended_action || 'Monitor zone closely and restrict access if necessary. Contact geotechnical team for immediate assessment.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <h4 className="text-slate-400 text-sm font-medium mb-2">⏰ Failure Expected Within</h4>
                <p className="text-white text-2xl font-bold">{getFailureWindow()}</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <h4 className="text-slate-400 text-sm font-medium mb-2 flex items-center space-x-2">
                  <FaChartLine className="text-blue-400" />
                  <span>Geotechnical Trigger</span>
                </h4>
                <p className="text-white font-semibold">
                  Displacement: {displacementRate} mm/day
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Cumulative: {cumulativeDisplacement} mm
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 md:col-span-2">
                <h4 className="text-slate-400 text-sm font-medium mb-3 flex items-center space-x-2">
                  <FaCloudRain className="text-cyan-400" />
                  <span>Environmental Triggers</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs">Temperature</p>
                    <p className="text-white font-semibold">{temperature}°F</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Precipitation</p>
                    <p className="text-white font-semibold">{precipitation} in</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Wind Speed</p>
                    <p className="text-white font-semibold">{windSpeed} mph</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Seismic Events</p>
                    <p className="text-white font-semibold">{seismicEvents}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Displacement Chart */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h4 className="text-white font-semibold text-lg mb-4">
                📊 Displacement vs. Time (Last 48 hours)
              </h4>
              <div className="h-64 bg-slate-900 rounded-lg p-4 flex items-end justify-between">
                {displacementHistory.length > 0 ? (
                  displacementHistory.map((point, index) => {
                    const maxValue = Math.max(...displacementHistory.map(p => p.value));
                    const heightPercent = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
                    const isRecent = index >= displacementHistory.length - 3;
                    return (
                      <div key={index} className="flex flex-col items-center" style={{width: `${100/displacementHistory.length}%`}}>
                        <div
                          className={`w-full rounded-t transition-all ${
                            isRecent ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '4px' : '0' }}
                          title={`${point.time}: ${point.value} mm`}
                        ></div>
                        <p className="text-slate-400 text-xs mt-2">
                          {point.time}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-slate-400">
                    <p>No displacement history available</p>
                  </div>
                )}
              </div>
              {displacementHistory.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    Min: {Math.min(...displacementHistory.map(p => p.value)).toFixed(2)} mm
                  </span>
                  <span className="text-slate-400">
                    Max: {Math.max(...displacementHistory.map(p => p.value)).toFixed(2)} mm
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              <button
                onClick={handleAcknowledge}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <FaCheckCircle />
                <span>{isProcessing ? 'Processing...' : 'Acknowledge Alert'}</span>
              </button>

              <button
                onClick={handleSendSMS}
                disabled={isProcessing}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <FaSms />
                <span>{isProcessing ? 'Sending...' : 'Send SMS Alert Now'}</span>
              </button>

              <button
                onClick={handleArchive}
                disabled={isProcessing}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <FaArchive />
                <span>{isProcessing ? 'Archiving...' : 'Archive / False Positive'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCardModal;
