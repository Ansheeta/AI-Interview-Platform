import api from './api';

export const interviewService = {
  start: (payload) => api.post('/interviews', payload),
  getById: (id) => api.get(`/interviews/${id}`),
  submit: (id, payload) => api.post(`/interviews/${id}/submit`, payload),
  abandon: (id) => api.patch(`/interviews/${id}/abandon`),
  getHistory: (params) => api.get('/interviews/history', { params }),
};
