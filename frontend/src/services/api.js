import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Insights API
export const insightsAPI = {
  getAll: () => api.get('/api/insights'),
  getById: (id) => api.get(`/api/insights/${id}`),
}

// Metrics API
export const metricsAPI = {
  getAll: (params) => api.get('/api/metrics', { params }),
  getStats: () => api.get('/api/metrics/stats'),
  getById: (id) => api.get(`/api/metrics/${id}`),
  create: (data) => api.post('/api/metrics', data),
  update: (id, data) => api.put(`/api/metrics/${id}`, data),
  delete: (id) => api.delete(`/api/metrics/${id}`),
}

// Segments API
export const segmentsAPI = {
  getAll: () => api.get('/api/segments'),
  getById: (id) => api.get(`/api/segments/${id}`),
}

export default api

