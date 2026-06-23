import api from './client'

export const authApi = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
}

export const adminApi = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
  users: () => api.get('/admin/users').then((r) => r.data),
}

export const productApi = {
  list: (params) => api.get('/products', { params }).then((r) => r.data),
  create: (data) => api.post('/products', data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`),
}

export const categoryApi = {
  list: () => api.get('/categories').then((r) => r.data),
  create: (data) => api.post('/categories', data).then((r) => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`),
}

export const brandApi = {
  list: () => api.get('/brands').then((r) => r.data),
  create: (data) => api.post('/brands', data).then((r) => r.data),
  update: (id, data) => api.put(`/brands/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/brands/${id}`),
}

export const orderApi = {
  all: () => api.get('/orders/admin/all').then((r) => r.data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }).then((r) => r.data),
}
