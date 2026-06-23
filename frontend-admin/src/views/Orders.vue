<template>
  <AdminLayout>
    <template #title>Orders</template>
    <div>
      <div class="card">
        <div class="card-header">
          <h2>All Orders ({{ orders.length }})</h2>
        </div>
        <div v-if="loading" class="spinner"></div>
        <div v-else-if="orders.length === 0" class="empty-state">
          <h3>No orders yet</h3>
          <p>Customer orders will appear here.</p>
        </div>
        <div v-else class="tbl-wrap">
          <table>
            <thead>
              <tr><th>Order</th><th>User</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id">
                <td><strong>#{{ o.id }}</strong></td>
                <td>{{ o.user_id }}</td>
                <td>
                  {{ o.items.length }} item(s)
                  <div v-for="it in o.items.slice(0, 2)" :key="it.id" style="font-size:0.78rem;color:var(--muted)">
                    {{ it.product_name }} × {{ it.quantity }}
                  </div>
                </td>
                <td><strong>${{ o.total.toFixed(2) }}</strong></td>
                <td>
                  <select :value="o.status" @change="updateStatus(o.id, $event.target.value)" class="status-select">
                    <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                  </select>
                </td>
                <td style="color:var(--muted);font-size:0.85rem">{{ fmtDate(o.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { orderApi } from '../api'

const orders = ref([])
const loading = ref(true)
const statuses = ['pending', 'shipped', 'delivered', 'cancelled']

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const load = async () => {
  loading.value = true
  try { orders.value = await orderApi.all() } catch {} finally { loading.value = false }
}
onMounted(load)

const updateStatus = async (id, status) => {
  try { await orderApi.updateStatus(id, status); await load() } catch {}
}
</script>

<style scoped>
.status-select {
  padding: 5px 8px;
  border: 1.5px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.status-select:focus { outline: none; border-color: var(--gold); }
</style>
