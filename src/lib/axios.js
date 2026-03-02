import axios from 'axios';

// Create a centralized Axios instance
// Allows us to configure base URLs, headers, and interceptors in one place
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Request Interceptor
// Useful for adding Auth tokens to every request automatically
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
// Centralized error handling and data unwrapping
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly, simplifying component code
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message || 'Something went wrong';
    
    // 1. If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('[Axios] Access token expired, attempting silent refresh...');
        // Call the refresh endpoint
        await apiClient.post('/auth/refresh');
        
        // If refresh successful, retry the original request
        console.log('[Axios] Refresh successful, retrying original request');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[Axios] Refresh failed, redirecting to login');
        // If refresh fails, user must log in again
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status !== 401) {
      console.error('API Error:', message);
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default apiClient;
