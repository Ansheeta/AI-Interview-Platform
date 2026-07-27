import api from './api';

export const questionBankService = {
  list: (params) => api.get('/questions', { params }),
  listBookmarked: () => api.get('/questions/bookmarks'),
  toggleBookmark: (id) => api.post(`/questions/${id}/bookmark`),
};

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getScoreTrend: (granularity) => api.get('/analytics/score-trend', { params: { granularity } }),
  getTopicWise: () => api.get('/analytics/topic-wise'),
};

export const settingsService = {
  get: () => api.get('/settings'),
  update: (payload) => api.patch('/settings', payload),
  deleteAccount: (payload) => api.delete('/settings/account', { data: payload }),
};
