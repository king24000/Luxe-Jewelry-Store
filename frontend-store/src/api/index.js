import api from './client'

// ----- Auth -----
export const authApi = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
}

// ----- Catalog (public) -----
export const catalogApi = {
  categories: () => api.get('/categories').then((r) => r.data),
  brands: () => api.get('/brands').then((r) => r.data),
  products: (params = {}) => api.get('/products', { params }).then((r) => r.data),
  product: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
}

// ----- Cart (auth) -----
export const cartApi = {
  list: () => api.get('/cart').then((r) => r.data),
  add: (product_id, quantity = 1) => api.post('/cart', { product_id, quantity }).then((r) => r.data),
  update: (item_id, quantity) => api.put(`/cart/${item_id}`, { quantity }).then((r) => r.data),
  remove: (item_id) => api.delete(`/cart/${item_id}`),
  clear: () => api.delete('/cart'),
}

// ----- Wishlist (auth) -----
export const wishlistApi = {
  list: () => api.get('/wishlist').then((r) => r.data),
  add: (product_id) => api.post(`/wishlist/${product_id}`).then((r) => r.data),
  remove: (product_id) => api.delete(`/wishlist/${product_id}`),
}

// ----- Orders (auth) -----
export const orderApi = {
  create: (shipping_address) => api.post('/orders', { shipping_address }).then((r) => r.data),
  list: () => api.get('/orders').then((r) => r.data),
  get: (id) => api.get(`/orders/${id}`).then((r) => r.data),
}
