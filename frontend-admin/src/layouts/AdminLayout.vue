<template>
  <div class="admin-shell">
    <aside class="sidebar" :class="{ open }">
      <div class="sidebar-head">
        <router-link to="/dashboard" class="brand" style="display: flex; align-items: center; gap: 10px;">
          <svg class="brand-logo-svg" viewBox="0 0 100 100" fill="none" width="28" height="28" style="flex-shrink: 0;">
            <defs>
              <linearGradient id="adminLuxeGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#b8860b"/>
                <stop offset="30%" stop-color="#e5c158"/>
                <stop offset="50%" stop-color="#fff8db"/>
                <stop offset="70%" stop-color="#e5c158"/>
                <stop offset="100%" stop-color="#b8860b"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" stroke="url(#adminLuxeGold)" stroke-width="4" stroke-dasharray="6 6" opacity="0.8"/>
            <circle cx="50" cy="50" r="38" stroke="url(#adminLuxeGold)" stroke-width="3"/>
            <path d="M 30,45 C 30,35 50,30 50,30 C 50,30 70,35 70,45 C 70,55 50,75 50,75 C 50,75 30,55 30,45 Z" stroke="url(#adminLuxeGold)" stroke-width="4" fill="url(#adminLuxeGold)" fill-opacity="0.2"/>
            <line x1="50" y1="30" x2="50" y2="75" stroke="url(#adminLuxeGold)" stroke-width="3"/>
            <line x1="30" y1="45" x2="70" y2="45" stroke="url(#adminLuxeGold)" stroke-width="3"/>
          </svg>
          <div>
            Luxe<span>&amp;</span>Co
            <small style="margin-top: 1px;">Admin</small>
          </div>
        </router-link>
        <button class="close-btn" @click="open = false" aria-label="Close">✕</button>
      </div>
      <nav class="sidebar-nav">
        <router-link v-for="item in menu" :key="item.to" :to="item.to" class="nav-item" @click="open = false">
          <span class="icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-foot">
        <a href="http://localhost:5173" target="_blank" rel="noreferrer" class="nav-item">
          <span class="icon">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </span>
          <span>View Store</span>
        </a>
        <button class="nav-item" @click="logout" style="width: 100%; text-align: left;">
          <span class="icon">
            <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <button class="burger" @click="open = true" aria-label="Menu">☰</button>
        <div class="topbar-title"><slot name="title" /></div>
        <div class="topbar-user">
          {{ auth.user?.name }}
          <span class="badge-soft">{{ auth.user?.role }}</span>
        </div>
      </header>
      <div class="admin-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, clearSession } from '../store/auth'

const router = useRouter()
const open = ref(false)

const menu = [
  { 
    to: '/dashboard', 
    icon: `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>`, 
    label: 'Dashboard' 
  },
  { 
    to: '/products', 
    icon: `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>`, 
    label: 'Products' 
  },
  { 
    to: '/categories', 
    icon: `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`, 
    label: 'Categories' 
  },
  { 
    to: '/brands', 
    icon: `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`, 
    label: 'Brands' 
  },
  { 
    to: '/orders', 
    icon: `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`, 
    label: 'Orders' 
  },
  { 
    to: '/users', 
    icon: `<svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`, 
    label: 'Users' 
  },
]

const logout = () => {
  clearSession()
  router.push('/login')
}
</script>
