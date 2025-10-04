import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaSync } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import { useAlertStore } from '../store/alertStore';

const Sidebar = ({ onAlertClick }) => {
  const { alerts, fetchAlerts, loading } = useAlertStore();
  const [showCritical, setShowCritical] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showSafe, setShowSafe] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch alerts on mount
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  // Categorize alerts by severity
  const categorizeAlerts = () => {
    const categorized = {
      critical: [],
      warning: [],
      safe: []
    };

    // Filter only ACTIVE alerts
    const activeAlerts = alerts.filter(alert => alert.status === 'ACTIVE');

    activeAlerts.forEach(alert => {
      const score = parseFloat(alert.risk_score || alert.riskScore || 0);
      if (score >= 75) {
        categorized.critical.push(alert);
      } else if (score >= 50) {
        categorized.warning.push(alert);
      } else {
        categorized.safe.push(alert);
      }
    });

    return categorized;
  };

  const categorized = categorizeAlerts();

  const AlertCategory = ({ title, alerts, color, isExpanded, onToggle, icon }) => (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-white font-semibold mb-3 hover:text-blue-400 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${color}`}></span>
          <span>{title}</span>
          <span className="text-slate-400 text-sm">({alerts.length})</span>
        </div>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">No {title.toLowerCase()}</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onAlertClick && onAlertClick(alert)}
                className={`bg-slate-800 hover:bg-slate-750 rounded-lg p-4 cursor-pointer transition-all border-l-4 ${
                  color === 'bg-red-500' ? 'border-red-500' :
                  color === 'bg-orange-500' ? 'border-orange-500' : 'border-green-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge type={alert.alert_type || alert.type} />
                  <span className="text-xs text-slate-500">
                    {alert.time || new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="text-white font-medium text-sm mb-1">
                  {alert.zone_name || alert.zone}
                </h4>
                <p className="text-slate-400 text-xs">
                  Risk: {alert.risk_score || alert.riskScore}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Active Alerts</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh alerts"
          >
            <FaSync className={`${refreshing || loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-sm text-slate-400">
          {alerts.filter(a => a.status === 'ACTIVE').length} alert{alerts.filter(a => a.status === 'ACTIVE').length !== 1 ? 's' : ''} requiring attention
        </p>
      </div>

      {/* Alerts by Category */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && alerts.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <FaSync className="animate-spin text-3xl mx-auto mb-2" />
            <p>Loading alerts...</p>
          </div>
        ) : (
          <>
            {/* Critical (Red) */}
            <AlertCategory
              title="Critical Alerts"
              alerts={categorized.critical}
              color="bg-red-500"
              isExpanded={showCritical}
              onToggle={() => setShowCritical(!showCritical)}
              icon="🔴"
            />

            {/* Warning (Orange) */}
            <AlertCategory
              title="Warning Alerts"
              alerts={categorized.warning}
              color="bg-orange-500"
              isExpanded={showWarning}
              onToggle={() => setShowWarning(!showWarning)}
              icon="🟠"
            />

            {/* Safe (Green) */}
            <AlertCategory
              title="Safe Zones"
              alerts={categorized.safe}
              color="bg-green-500"
              isExpanded={showSafe}
              onToggle={() => setShowSafe(!showSafe)}
              icon="🟢"
            />
          </>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/50">
            <p className="text-red-400 text-2xl font-bold text-center">
              {categorized.critical.length}
            </p>
            <p className="text-red-400 text-xs text-center">Critical</p>
          </div>
          <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-500/50">
            <p className="text-orange-400 text-2xl font-bold text-center">
              {categorized.warning.length}
            </p>
            <p className="text-orange-400 text-xs text-center">Warning</p>
          </div>
          <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/50">
            <p className="text-green-400 text-2xl font-bold text-center">
              {categorized.safe.length}
            </p>
            <p className="text-green-400 text-xs text-center">Safe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
