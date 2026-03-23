import apiClient from '../../../lib/axios';

// API Layer: Encapsulate all Quiz-related backend calls here
// Keep business logic separate from UI components
export const quizApi = {
  createQuiz: async (data) => {
    // This calls POST /api/quizzes
    // apiClient automatically adds Authorization headers if token exists
    const response = await apiClient.post('/quizzes', data);
    return response;
  },
  
  getQuizzes: async (params) => {
    // GET /api/quizzes?page=1&limit=10
    const response = await apiClient.get('/quizzes', { params });
    return response; // Interceptor already unwraps response.data
  },
  
  getQuizById: async (id) => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response;
  },
  
  updateQuiz: async (id, data) => {
    const response = await apiClient.patch(`/quizzes/${id}`, data);
    return response;
  },
  
  deleteQuiz: async (id) => {
    const response = await apiClient.delete(`/quizzes/${id}`);
    return response;
  },

  getStats: async () => {
    const response = await apiClient.get('/analytics/stats');
    return response;
  }
};

