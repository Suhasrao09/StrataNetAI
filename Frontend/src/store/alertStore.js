import { create } from 'zustand';
import api from '../services/api';

const useAlertStore = create((set, get) => ({
  alerts: [],
  activeAlert: null,
  loading: false,
  error: null,

  // Fetch alerts from backend
  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/alerts/');
      const alertsData = response.data.results || response.data || [];
      
      const formattedAlerts = alertsData.map(alert => ({
        id: alert.id,
        alert_id: alert.alert_id,
        zone: alert.zone_name,
        zone_name: alert.zone_name,
        type: alert.alert_type,
        alert_type: alert.alert_type,
        risk_score: alert.risk_score,
        riskScore: alert.risk_score,
        status: alert.status,
        time: new Date(alert.created_at).toLocaleTimeString(),
        created_at: alert.created_at,
        recommended_action: alert.recommended_action,
        sensor_reading: alert.sensor_reading,
        description: `Risk score: ${alert.risk_score} - ${alert.recommended_action || 'Monitor zone closely'}`
      }));
      
      set({ alerts: formattedAlerts, loading: false });
      return formattedAlerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  // Set active alert - SIMPLE VERSION
  setActiveAlert: (alert) => {
    console.log('Setting active alert:', alert);
    set({ activeAlert: alert });
  },

  // Add new alert
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts] 
  })),

  // Remove alert
  removeAlert: (alertId) => set((state) => ({
    alerts: state.alerts.filter(alert => alert.id !== alertId)
  })),

  // Update alert status
  updateAlertStatus: (alertId, status) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === alertId ? { ...alert, status } : alert
    )
  })),

  // Clear all alerts
  clearAlerts: () => set({ alerts: [] }),
}));

export { useAlertStore };
