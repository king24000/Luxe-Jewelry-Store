<template>
  <AdminLayout>
    <template #title>Dashboard</template>
    <div>
      <div v-if="loading" class="spinner"></div>
      <template v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" style="color: var(--gold); display: block; margin-bottom: 8px;">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div class="label">Products</div>
            <div class="value">{{ stats.products }}</div>
          </div>
          <div class="stat-card">
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" style="color: var(--gold); display: block; margin-bottom: 8px;">
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
              </svg>
            </div>
            <div class="label">Orders</div>
            <div class="value">{{ stats.orders }}</div>
          </div>
          <div class="stat-card">
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" style="color: var(--gold); display: block; margin-bottom: 8px;">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="label">Users</div>
            <div class="value">{{ stats.users }}</div>
          </div>
          <div class="stat-card">
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" style="color: var(--gold); display: block; margin-bottom: 8px;">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="label">Revenue</div>
            <div class="value">${{ stats.revenue.toFixed(2) }}</div>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div v-if="recentOrders.length === 0" class="empty-state">
            <h3>No orders yet</h3>
            <p>Orders will appear here once customers start shopping.</p>
          </div>
          <div v-else class="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in recentOrders" :key="o.id">
                  <td><strong>#{{ o.id }}</strong></td>
                  <td>{{ o.user_id }}</td>
                  <td>{{ o.items.length }} item(s)</td>
                  <td><strong>${{ o.total.toFixed(2) }}</strong></td>
                  <td><span :class="['status-tag', `status-${o.status}`]">{{ o.status }}</span></td>
                  <td style="color:var(--muted);font-size:0.85rem">{{ fmtDate(o.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { adminApi, orderApi } from '../api'

const stats = ref({ products: 0, orders: 0, users: 0, revenue: 0, pending_orders: 0 })
const recentOrders = ref([])
const loading = ref(true)

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

onMounted(async () => {
  try {
    const [s, o] = await Promise.all([adminApi.stats(), orderApi.all()])
    stats.value = s
    recentOrders.value = o.slice(0, 10)
  } catch {
    /* handled by interceptor */
  } finally {
    loading.value = false
  }
})
</script>
