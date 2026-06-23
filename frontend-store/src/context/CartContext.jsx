import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { cartApi } from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      setItems(await cartApi.list())
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addToCart = async (productId, quantity = 1) => {
    await cartApi.add(productId, quantity)
    await refresh()
  }

  const updateQty = async (itemId, quantity) => {
    await cartApi.update(itemId, quantity)
    await refresh()
  }

  const removeItem = async (itemId) => {
    await cartApi.remove(itemId)
    await refresh()
  }

  const clear = async () => {
    await cartApi.clear()
    await refresh()
  }

  // Derived totals
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, loading, count, subtotal, refresh, addToCart, updateQty, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
