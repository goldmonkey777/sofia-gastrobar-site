/**
 * Carrinho de Pedidos na Mesa
 * Componente para fazer pedidos direto da mesa
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash, CheckCircle, X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import type { MenuItem } from '@/lib/menuHelpers'

interface CartItem {
  id: string
  name: { pt: string; es: string; en: string } | string
  price: number
  quantity: number
  notes?: string
}

interface TableOrderCartProps {
  tableId: string
  menuItems: MenuItem[]
  onOrderPlaced?: (orderId: string) => void
}

const translations = {
  cart: {
    pt: 'Carrinho',
    es: 'Carrito',
    en: 'Cart',
  },
  addToCart: {
    pt: 'Adicionar',
    es: 'Añadir',
    en: 'Add',
  },
  removeFromCart: {
    pt: 'Remover',
    es: 'Quitar',
    en: 'Remove',
  },
  subtotal: {
    pt: 'Subtotal',
    es: 'Subtotal',
    en: 'Subtotal',
  },
  total: {
    pt: 'Total',
    es: 'Total',
    en: 'Total',
  },
  placeOrder: {
    pt: 'Fazer Pedido',
    es: 'Realizar Pedido',
    en: 'Place Order',
  },
  placingOrder: {
    pt: 'Enviando...',
    es: 'Enviando...',
    en: 'Sending...',
  },
  orderPlaced: {
    pt: 'Pedido Enviado!',
    es: '¡Pedido Enviado!',
    en: 'Order Placed!',
  },
  emptyCart: {
    pt: 'Seu carrinho está vazio',
    es: 'Tu carrito está vacío',
    en: 'Your cart is empty',
  },
  notes: {
    pt: 'Observações (opcional)',
    es: 'Notas (opcional)',
    en: 'Notes (optional)',
  },
}

export function TableOrderCart({ tableId, menuItems, onOrderPlaced }: TableOrderCartProps) {
  const { language, isReady } = useLanguage()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')

  if (!isReady) return null

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find((i: CartItem) => i.id === item.id)
      if (existing) {
        return prev.map((i: CartItem) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      const itemName = typeof item.name === 'string' ? item.name : item.name.en
      return [...prev, { id: item.id, name: itemName, price: item.price, quantity: 1 }]
    })
    setIsOpen(true)
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter((i: CartItem) => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev =>
      prev.map((i: CartItem) => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const findMenuItem = (id: string) => menuItems.find(item => item.id === id)

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return

    setIsPlacing(true)

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          items: cart.map((item: CartItem) => ({
            id: item.id,
            name: typeof item.name === 'string' ? item.name : translate(item.name, language),
            price: item.price,
            quantity: item.quantity,
            notes: item.notes,
          })),
          notes: orderNotes.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer pedido')
      }

      setOrderPlaced(true)
      setCart([])
      setOrderNotes('')
      setIsPlacing(false)

      if (onOrderPlaced) {
        onOrderPlaced(data.order.id)
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setOrderPlaced(false)
        setIsOpen(false)
      }, 3000)
    } catch (error) {
      console.error('Error placing order:', error)
      setIsPlacing(false)
      alert(error instanceof Error ? error.message : 'Erro ao fazer pedido. Tente novamente.')
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-yellow-500 text-black rounded-full p-4 shadow-lg hover:bg-yellow-400 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {translate(translations.cart, language)} ({cartItemCount})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center text-white/60 py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>{translate(translations.emptyCart, language)}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item: CartItem) => {
                      const fullMenuItem = findMenuItem(item.id)
                      return (
                        <div
                          key={item.id}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-white font-semibold">
                                {typeof item.name === 'string' ? item.name : translate(item.name, language)}
                              </h3>
                              <p className="text-white/60 text-sm">
                                €{item.price.toFixed(2)} × {item.quantity} = €
                                {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-white/10 text-white rounded p-1"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-white/10 text-white rounded p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-white/10 p-4 space-y-4">
                  <div className="flex justify-between text-white">
                    <span>{translate(translations.subtotal, language)}:</span>
                    <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>{translate(translations.total, language)}:</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>

                  <textarea
                    value={orderNotes}
                    onChange={e => setOrderNotes(e.target.value)}
                    placeholder={translate(translations.notes, language)}
                    rows={2}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 resize-none"
                  />

                  {orderPlaced ? (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-white font-semibold">
                        {translate(translations.orderPlaced, language)}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacing}
                      className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPlacing
                        ? translate(translations.placingOrder, language)
                        : translate(translations.placeOrder, language)}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export addToCart function via context or props */}
      {/* This would need to be passed to TableMenu component */}
    </>
  )
}

// Export a hook to use the cart
export function useTableOrderCart() {
  // This would be implemented with context API
  // For now, return a simple interface
  return {
    addToCart: (item: MenuItem) => {
      // This will be connected via context
      console.log('Add to cart:', item)
    },
  }
}

