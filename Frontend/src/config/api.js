import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (email, password, selectedRole) =>
    api.post('/auth/login/', { email, password, selectedRole }),
  
  refreshToken: (refresh) =>
    api.post('/token/refresh/', { refresh }),
};

export const alertAPI = {
  getAllAlerts: () => api.get('/alerts/'),
  getActiveAlerts: () => api.get('/alerts/active_alerts/'),
  getStatistics: () => api.get('/alerts/statistics/'),
  updateAlertStatus: (id, status) =>
    api.patch(`/alerts/${id}/update_status/`, { status }),
};

export const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/upload-csv/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;
