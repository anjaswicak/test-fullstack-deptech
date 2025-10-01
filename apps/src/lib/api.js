import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Flag untuk mencegah multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Function untuk refresh token
const refreshToken = async () => {
  try {
    const refreshTokenValue = Cookies.get('refresh_token');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
      refresh_token: refreshTokenValue
    });

    const { access_token, refresh_token } = response.data.data;
    
    // Update cookies dengan token baru
    Cookies.set('token', access_token, { expires: 1 }); // 1 day
    Cookies.set('refresh_token', refresh_token, { expires: 7 }); // 7 days
    
    return access_token;
  } catch (error) {
    // Refresh token juga expired, logout user
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    window.location.href = '/login';
    throw error;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang refresh, masukkan request ke queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        
        // Retry original request dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;