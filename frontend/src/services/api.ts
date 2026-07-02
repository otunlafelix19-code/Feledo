import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API calls
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// Crypto API calls
export const cryptoApi = {
  getAllCryptos: (params?: { vs_currency?: string; order?: string; per_page?: number; page?: number }) =>
    api.get('/crypto/list', { params }),
  getCryptoDetails: (id: string) =>
    api.get(`/crypto/details/${id}`),
  searchCryptos: (query: string) =>
    api.get(`/crypto/search/${query}`),
  getMarketChart: (id: string, days?: number) =>
    api.get(`/crypto/chart/${id}`, { params: { days } }),
  getTrendingCryptos: () =>
    api.get('/crypto/trending'),
  getMarketData: () =>
    api.get('/crypto/market/overview'),
};

export default api;
