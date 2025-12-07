/**
 * Global Cart Context - Carrinho Unificado
 * Funciona em: Home, Delivery, Mesa, Reservas
 */

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface GlobalCartItem {
  id: string
  name: string | { pt: string; es: string; en: string }
  price: number
  quantity: number
  image?: string
  notes?: string
  category?: string
}

interface GlobalCartContextType {
  items: GlobalCartItem[]
  addItem: (item: GlobalCartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const GlobalCartContext = createContext<GlobalCartContextType | null>(null)

export function GlobalCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GlobalCartItem[]>([])

  const addItem = (item: GlobalCartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <GlobalCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </GlobalCartContext.Provider>
  )
}

export function useGlobalCart() {
  const context = useContext(GlobalCartContext)
  if (!context) {
    throw new Error('useGlobalCart must be used within GlobalCartProvider')
  }
  return context
}

