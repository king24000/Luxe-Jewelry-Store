import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { auth } from '../store/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { public: true } },
  {
    path: '/',
    component: RouterView,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'products', name: 'products', component: () => import('../views/Products.vue') },
      { path: 'categories', name: 'categories', component: () => import('../views/Categories.vue') },
      { path: 'brands', name: 'brands', component: () => import('../views/Brands.vue') },
      { path: 'orders', name: 'orders', component: () => import('../views/Orders.vue') },
      { path: 'users', name: 'users', component: () => import('../views/Users.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard: every non-login route needs an admin session.
router.beforeEach((to) => {
  const allowed = to.meta.public
  if (!allowed && (!auth.token || auth.user?.role !== 'admin')) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.token && auth.user?.role === 'admin') {
    return { name: 'dashboard' }
  }
})

export default router
