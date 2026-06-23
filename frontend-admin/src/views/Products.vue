<template>
  <AdminLayout>
    <template #title>Products</template>
    <div>
      <div class="card">
        <div class="card-header">
          <h2>All Products ({{ products.length }})</h2>
          <button class="btn btn-primary btn-sm" @click="openModal()">+ Add Product</button>
        </div>

        <div v-if="loading" class="spinner"></div>
        <div v-else-if="products.length === 0" class="empty-state">
          <h3>No products</h3>
          <p>Add your first product to get started.</p>
        </div>
        <div v-else class="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th></th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id">
                <td>
                  <div class="thumb">
                    <img v-if="p.image_url" :src="p.image_url" :alt="p.name" />
                  </div>
                </td>
                <td>
                  <div class="product-cell">
                    <div>
                      <div class="name">{{ p.name }}</div>
                      <div class="sub">{{ p.slug }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ p.category?.name || '—' }}</td>
                <td>{{ p.brand?.name || '—' }}</td>
                <td><strong>${{ p.price.toFixed(2) }}</strong></td>
                <td>
                  <span :style="{ color: p.stock <= 5 ? 'var(--danger)' : 'var(--ink)' }">{{ p.stock }}</span>
                </td>
                <td class="text-right">
                  <button class="btn btn-ghost btn-sm" @click="openModal(p)">Edit</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--danger)" @click="remove(p)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <h2>{{ editing ? 'Edit Product' : 'Add Product' }}</h2>
          <form @submit.prevent="save">
            <div class="field">
              <label>Name</label>
              <input v-model="form.name" required />
            </div>
            <div class="field">
              <label>Description</label>
              <textarea v-model="form.description" rows="3" />
            </div>
            <div class="form-row">
              <div class="field">
                <label>Price ($)</label>
                <input v-model.number="form.price" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>Stock</label>
                <input v-model.number="form.stock" type="number" min="0" required />
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label>Category</label>
                <select v-model="form.category_id" required>
                  <option :value="null" disabled>Select…</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="field">
                <label>Brand</label>
                <select v-model="form.brand_id" required>
                  <option :value="null" disabled>Select…</option>
                  <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Image URL</label>
              <input v-model="form.image_url" placeholder="https://..." />
            </div>
            <div class="field">
              <label>Featured</label>
              <select v-model="form.featured">
                <option :value="0">No</option>
                <option :value="1">Yes</option>
              </select>
            </div>
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
import { productApi, categoryApi, brandApi } from '../api'

const products = ref([])
const categories = ref([])
const brands = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(null)
const busy = ref(false)
const modalError = ref('')

const blank = () => ({ name: '', description: '', price: 0, stock: 0, category_id: null, brand_id: null, image_url: '', featured: 0 })
const form = ref(blank())

const load = async () => {
  loading.value = true
  try {
    const [p, c, b] = await Promise.all([productApi.list(), categoryApi.list(), brandApi.list()])
    products.value = p
    categories.value = c
    brands.value = b
  } catch { /* handled */ } finally {
    loading.value = false
  }
}
onMounted(load)

const openModal = (p = null) => {
  editing.value = p
  if (p) {
    form.value = { name: p.name, description: p.description, price: p.price, stock: p.stock, category_id: p.category_id, brand_id: p.brand_id, image_url: p.image_url, featured: p.featured }
  } else {
    form.value = blank()
  }
  modalError.value = ''
  showModal.value = true
}

const save = async () => {
  modalError.value = ''
  busy.value = true
  try {
    if (editing.value) {
      await productApi.update(editing.value.id, form.value)
    } else {
      await productApi.create(form.value)
    }
    showModal.value = false
    await load()
  } catch (err) {
    modalError.value = err.response?.data?.detail || 'Save failed'
  } finally {
    busy.value = false
  }
}

const remove = async (p) => {
  if (!confirm(`Delete "${p.name}"?`)) return
  try { await productApi.remove(p.id); await load() } catch { /* handled */ }
}
</script>
