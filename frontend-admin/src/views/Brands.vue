<template>
  <AdminLayout>
    <template #title>Brands</template>
    <div>
      <div class="card">
        <div class="card-header">
          <h2>Brands ({{ items.length }})</h2>
          <button class="btn btn-primary btn-sm" @click="openModal()">+ Add Brand</button>
        </div>
        <div v-if="loading" class="spinner"></div>
        <div v-else class="tbl-wrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Slug</th><th>Description</th><th></th></tr></thead>
            <tbody>
              <tr v-for="b in items" :key="b.id">
                <td>{{ b.id }}</td>
                <td><strong>{{ b.name }}</strong></td>
                <td style="color:var(--muted);font-size:0.85rem">{{ b.slug }}</td>
                <td style="color:var(--ink-soft)">{{ b.description || '—' }}</td>
                <td class="text-right">
                  <button class="btn btn-ghost btn-sm" @click="openModal(b)">Edit</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--danger)" @click="remove(b)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <h2>{{ editing ? 'Edit' : 'Add' }} Brand</h2>
          <form @submit.prevent="save">
            <div class="field"><label>Name</label><input v-model="form.name" required /></div>
            <div class="field"><label>Description</label><textarea v-model="form.description" rows="3" /></div>
            <div class="field"><label>Image URL</label><input v-model="form.image_url" /></div>
            <div v-if="modalError" class="alert alert-error" style="background:#fdecec;color:var(--danger);padding:8px 12px;border-radius:var(--radius-sm);margin-top:8px;">{{ modalError }}</div>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" @click="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="busy">{{ busy ? 'Saving…' : 'Save' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { brandApi } from '../api'

const items = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(null)
const busy = ref(false)
const modalError = ref('')
const blank = () => ({ name: '', description: '', image_url: '' })
const form = ref(blank())

const load = async () => { loading.value = true; try { items.value = await brandApi.list() } catch {} finally { loading.value = false } }
onMounted(load)

const openModal = (b) => { editing.value = b || null; form.value = b ? { name: b.name, description: b.description, image_url: b.image_url } : blank(); modalError.value = ''; showModal.value = true }
const save = async () => {
  modalError.value = ''; busy.value = true
  try { editing.value ? await brandApi.update(editing.value.id, form.value) : await brandApi.create(form.value); showModal.value = false; await load() }
  catch (e) { modalError.value = e.response?.data?.detail || 'Save failed' } finally { busy.value = false }
}
const remove = async (b) => { if (!confirm(`Delete "${b.name}"?`)) return; try { await brandApi.remove(b.id); await load() } catch {} }
</script>
