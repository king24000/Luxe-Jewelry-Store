<template>
  <div class="login-wrap">
    <div class="login-card">
      <h1>Admin Login</h1>
      <p class="sub">Luxe &amp; Co Management Panel</p>

      <div class="demo">
        <strong>Demo admin:</strong> admin@store.com / admin123
      </div>

      <div v-if="error" class="alert alert-error" style="background:#fdecec;color:var(--danger);padding:10px 14px;border-radius:var(--radius-sm);margin-bottom:14px;">{{ error }}</div>

      <form @submit.prevent="submit">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block" :disabled="busy">
          {{ busy ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authApi } from '../api'
import { setSession } from '../store/auth'

const router = useRouter()
const route = useRoute()
const form = reactive({ email: 'admin@store.com', password: 'admin123' })
const error = ref('')
const busy = ref(false)

const submit = async () => {
  error.value = ''
  busy.value = true
  try {
    const data = await authApi.login(form)
    if (data.user.role !== 'admin') {
      error.value = 'Access denied. Admin only.'
      return
    }
    setSession(data)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (err) {
    error.value = err.response?.data?.detail || 'Login failed'
  } finally {
    busy.value = false
  }
}
</script>
