import axios from 'axios';

// Create a centralized Axios instance
// Allows us to configure base URLs, headers, and interceptors in one place
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Log error for debugging (or send to Sentry)
    console.error('API Error:', message);

    // Optionally handle specific status codes (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Handle logout logic here
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default apiClient;
