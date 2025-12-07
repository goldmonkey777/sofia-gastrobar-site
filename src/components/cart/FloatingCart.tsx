/**
 * Floating Cart - Carrinho Flutuante Global
 * Aparece em todas as páginas quando há itens
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus, Trash } from 'lucide-react'
import { useGlobalCart } from '@/contexts/GlobalCartContext'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import Link from 'next/link'

export function FloatingCart() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount, clearCart } = useGlobalCart()
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const itemCount = getItemCount()
  const total = getTotal()

  if (itemCount === 0) return null

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-full p-4 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-yellow-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {translate({ pt: 'Seu Pedido', es: 'Tu Pedido', en: 'Your Order' }, language)}
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const itemName = typeof item.name === 'string' 
                      ? item.name 
                      : translate(item.name, language)
                    
                    return (
                      <div
                        key={item.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{itemName}</h3>
                            <p className="text-yellow-500 font-bold">€{item.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-white/40 hover:text-red-500 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded text-white flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded text-white flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-yellow-500 font-bold ml-auto">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">
                      {translate({ pt: 'Total', es: 'Total', en: 'Total' }, language)}
                    </span>
                    <span className="text-2xl font-bold text-yellow-500">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    href="/delivery"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl text-center hover:from-yellow-400 hover:to-yellow-500 transition-all"
                  >
                    {translate({ pt: 'Finalizar Pedido', es: 'Finalizar Pedido', en: 'Complete Order' }, language)}
                  </Link>
                  <button
                    onClick={clearCart}
                    className="w-full text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {translate({ pt: 'Limpar Carrinho', es: 'Limpiar Carrito', en: 'Clear Cart' }, language)}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

