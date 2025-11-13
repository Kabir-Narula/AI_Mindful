import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  signup: (email: string, username: string, password: string) =>
    api.post('/auth/signup', { email, username, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
}

export const entriesService = {
  create: (title: string, content: string, mood_level: number) =>
    api.post('/entries/', { title, content, mood_level }),
  getAll: (limit = 50, offset = 0) =>
    api.get('/entries/', { params: { limit, offset } }),
  getById: (id: number) => api.get(`/entries/${id}`),
  update: (id: number, data: any) => api.put(`/entries/${id}`, data),
  delete: (id: number) => api.delete(`/entries/${id}`),
}

export const agentService = {
  requestFollowup: (entry_id: number) =>
    api.post('/agent/followup', { entry_id }),
  getFollowups: (entry_id: number) =>
    api.get(`/agent/followups/${entry_id}`),
}

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getTrends: (days = 30) =>
    api.get('/analytics/trends', { params: { days } }),
}
