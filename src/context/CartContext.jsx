import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartCtx = createContext(null)
const LS_KEY = 'apt_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
  })
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  }, [items])

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id)
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i))
      }
      return [...prev, {
        id: product.id, name: product.name, price: product.price,
        image: product.image, brand: product.brand, model: product.model, qty,
      }]
    })
    setOpen(true)
  }

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)))
  const clear = () => setItems([])

  const value = useMemo(() => ({
    items,
    add, remove, setQty, clear,
    count: items.reduce((a, i) => a + i.qty, 0),
    subtotal: items.reduce((a, i) => a + i.price * i.qty, 0),
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
  }), [items, isOpen])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart يجب أن يُستخدم داخل CartProvider')
  return ctx
}
