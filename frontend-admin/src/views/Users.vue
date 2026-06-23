<template>
  <AdminLayout>
    <template #title>Users</template>
    <div>
      <div class="card">
        <div class="card-header">
          <h2>Registered Users ({{ users.length }})</h2>
        </div>
        <div v-if="loading" class="spinner"></div>
        <div v-else class="tbl-wrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td>{{ u.id }}</td>
                <td><strong>{{ u.name }}</strong></td>
                <td style="color:var(--ink-soft)">{{ u.email }}</td>
                <td><span :class="['badge-soft', u.role === 'admin' ? 'badge-gold' : '']">{{ u.role }}</span></td>
                <td style="color:var(--muted);font-size:0.85rem">{{ fmtDate(u.created_at) }}</td>
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
import { adminApi } from '../api'

const users = ref([])
const loading = ref(true)
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

onMounted(async () => {
  try { users.value = await adminApi.users() } catch {} finally { loading.value = false }
})
</script>
