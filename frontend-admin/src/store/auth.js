import { reactive } from 'vue'
import { authApi } from '../api'

// Simple reactive auth store (no Pinia — keeping deps light).
export const auth = reactive({
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  token: localStorage.getItem('admin_token') || null,
})

export function setSession(data) {
  auth.token = data.access_token
  auth.user = data.user
  localStorage.setItem('admin_token', data.access_token)
  localStorage.setItem('admin_user', JSON.stringify(data.user))
}

export function clearSession() {
  auth.token = null
  auth.user = null
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}

export async function restoreSession() {
  if (!auth.token) return false
  try {
    const me = await authApi.me()
    if (me.role !== 'admin') {
      clearSession()
      return false
    }
    auth.user = me
    return true
  } catch {
    clearSession()
    return false
  }
}
