import apiClient from '../../../lib/axios';

export const analyticsApi = {
  getOverviewStats: async (quizId) => {
    const params = quizId ? `?quizId=${quizId}` : '';
    const response = await apiClient.get(`/analytics/stats${params}`);
    return response; // Interceptor already unwraps
  },

  getFunnelData: async (quizId) => {
    const params = quizId ? `?quizId=${quizId}` : '';
    const response = await apiClient.get(`/analytics/funnel${params}`);
    return response;
  },

  getLeads: async (page = 1, limit = 10, quizId, search = '') => {
    const quizParam = quizId ? `&quizId=${quizId}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await apiClient.get(`/analytics/leads?page=${page}&limit=${limit}${quizParam}${searchParam}`);
    return response;
  },

  exportLeads: async (quizId, search = '') => {
    const quizParam = quizId ? `&quizId=${quizId}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    // Use responseType: 'blob' since we are expecting a file download, not JSON
    const response = await apiClient.get(`/analytics/export-leads?${quizParam}${searchParam}`, {
      responseType: 'blob'
    });
    return response;
  },

  getOutcomeDistribution: async (quizId) => {
    const params = quizId ? `?quizId=${quizId}` : '';
    const response = await apiClient.get(`/analytics/outcomes${params}`);
    return response;
  },

  getQuizPerformance: async () => {
    const response = await apiClient.get('/analytics/quiz-performance');
    return response;
  }
};
