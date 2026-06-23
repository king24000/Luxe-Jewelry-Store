import axios from 'axios'

// Base axios instance pointing at the FastAPI backend.
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear stale creds and bounce to login (unless already there).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const onLogin = window.location.pathname.startsWith('/login')
      const onRegister = window.location.pathname.startsWith('/register')
      if (!onLogin && !onRegister) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    return Promise.reject(error)
  }
)

export default api
