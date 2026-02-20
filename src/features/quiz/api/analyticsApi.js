import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const analyticsApi = {
  getOverviewStats: async (quizId) => {
    const params = quizId ? `?quizId=${quizId}` : '';
    const response = await api.get(`/analytics/stats${params}`);
    return response.data;
  },

  getFunnelData: async (quizId) => {
    const params = quizId ? `?quizId=${quizId}` : '';
    const response = await api.get(`/analytics/funnel${params}`);
    return response.data;
  },

  getLeads: async (page = 1, limit = 10, quizId, search = '') => {
    const quizParam = quizId ? `&quizId=${quizId}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/analytics/leads?page=${page}&limit=${limit}${quizParam}${searchParam}`);
    return response.data;
  },

  getOutcomeDistribution: async (quizId) => {
    const params = quizId ? `?quizId=${quizId}` : '';
    const response = await api.get(`/analytics/outcomes${params}`);
    return response.data;
  },

  getQuizPerformance: async () => {
    const response = await api.get('/analytics/quiz-performance');
    return response.data;
  }
};
