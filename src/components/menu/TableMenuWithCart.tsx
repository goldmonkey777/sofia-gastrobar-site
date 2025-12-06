/**
 * TableMenu com Carrinho Integrado
 * Versão do TableMenu que permite fazer pedidos direto da mesa
 */

'use client'

import { useState, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getCurrentHour, getFilteredMenuByTime, type MenuItem, type MenuCategory } from '@/lib/menuHelpers'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { Star, Utensils, ChefHat, Info, ShoppingCart, Plus, Minus, Trash, CheckCircle, X } from 'lucide-react'

// Context para compartilhar carrinho
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

interface CartItem {
  id: string
  name: { pt: string; es: string; en: string }
  price: number
  description: { pt: string; es: string; en: string }
  image: string
  quantity: number
  notes?: string
  popular?: boolean
  chefRecommend?: boolean
  sunsetSpecial?: boolean
  allergens?: string[]
}

interface TableMenuWithCartProps {
  tableId: string
  onOrderPlaced?: (orderId: string) => void
}

const translations = {
  popular: { pt: 'Popular', es: 'Popular', en: 'Popular' },
  chefRecommend: { pt: 'Chef Recomenda', es: 'Recomendación del Chef', en: "Chef's Pick" },
  sunsetSpecial: { pt: 'Especial Sunset', es: 'Especial Sunset', en: 'Sunset Special' },
  allergens: { pt: 'Alérgenos', es: 'Alérgenos', en: 'Allergens' },
  close: { pt: 'Fechar', es: 'Cerrar', en: 'Close' },
  menuTitle: { pt: 'Nosso Menu', es: 'Nuestro Menú', en: 'Our Menu' },
  menuSubtitle: { pt: 'Sabores que encantam, a qualquer hora do dia.', es: 'Sabores que encantan, a cualquier hora del día.', en: 'Enchanting flavors, any time of day.' },
  noItems: { pt: 'Nenhum item disponível nesta categoria.', es: 'No hay elementos disponibles en esta categoría.', en: 'No items available in this category.' },
  addToCart: { pt: 'Adicionar', es: 'Añadir', en: 'Add' },
  cart: { pt: 'Carrinho', es: 'Carrito', en: 'Cart' },
  subtotal: { pt: 'Subtotal', es: 'Subtotal', en: 'Subtotal' },
  total: { pt: 'Total', es: 'Total', en: 'Total' },
  placeOrder: { pt: 'Fazer Pedido', es: 'Realizar Pedido', en: 'Place Order' },
  placingOrder: { pt: 'Enviando...', es: 'Enviando...', en: 'Sending...' },
  orderPlaced: { pt: 'Pedido Enviado!', es: '¡Pedido Enviado!', en: 'Order Placed!' },
  emptyCart: { pt: 'Seu carrinho está vazio', es: 'Tu carrito está vacío', en: 'Your cart is empty' },
  notes: { pt: 'Observações (opcional)', es: 'Notas (opcional)', en: 'Notes (optional)' },
}

function CartProvider({ children, tableId, onOrderPlaced }: { children: React.ReactNode; tableId: string; onOrderPlaced?: (orderId: string) => void }) {
  const { language } = useLanguage()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev => prev.map(i => (i.id === itemId ? { ...i, quantity } : i)))
  }

  const clearCart = () => {
    setCart([])
    setOrderNotes('')
  }

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
          items: cart.map(item => ({
            id: item.id,
            name: translate(item.name, language),
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
      clearCart()
      setIsPlacing(false)

      if (onOrderPlaced) {
        onOrderPlaced(data.order.id)
      }

      setTimeout(() => {
        setOrderPlaced(false)
      }, 3000)
    } catch (error) {
      console.error('Error placing order:', error)
      setIsPlacing(false)
      alert(error instanceof Error ? error.message : 'Erro ao fazer pedido. Tente novamente.')
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
      
      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => {
            const drawer = document.getElementById('cart-drawer')
            if (drawer) {
              drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          }}
          className="fixed bottom-24 right-4 z-40 bg-yellow-500 text-black rounded-full p-4 shadow-lg hover:bg-yellow-400 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        </motion.button>
      )}

      {/* Cart Drawer */}
      {cartItemCount > 0 && (
        <div id="cart-drawer" className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 z-50 max-h-[60vh] overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {translate(translations.cart, language)} ({cartItemCount})
              </h2>
            </div>

            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">
                      {translate(item.name, language)}
                    </h3>
                    <p className="text-white/60 text-xs">
                      €{item.price.toFixed(2)} × {item.quantity} = €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-white/10 text-white rounded p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-semibold w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white/10 text-white rounded p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400 ml-2"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between text-white">
                <span>{translate(translations.subtotal, language)}:</span>
                <span className="font-semibold">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white text-lg font-bold">
                <span>{translate(translations.total, language)}:</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <textarea
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                placeholder={translate(translations.notes, language)}
                rows={2}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 resize-none text-sm"
              />

              {orderPlaced ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">
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
          </div>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function TableMenuWithCart({ tableId, onOrderPlaced }: TableMenuWithCartProps) {
  const { language, isReady } = useLanguage()
  const currentHour = getCurrentHour()
  const menu = getFilteredMenuByTime(currentHour)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  if (!isReady) return null

  return (
    <CartProvider tableId={tableId} onOrderPlaced={onOrderPlaced}>
      <MenuContent
        menu={menu}
        language={language}
        expandedItem={expandedItem}
        setExpandedItem={setExpandedItem}
      />
    </CartProvider>
  )
}

function MenuContent({
  menu,
  language,
  expandedItem,
  setExpandedItem,
}: {
  menu: ReturnType<typeof getFilteredMenuByTime>
  language: 'pt' | 'es' | 'en'
  expandedItem: string | null
  setExpandedItem: (id: string | null) => void
}) {
  const { addToCart } = useCart()

  const renderItemDetails = (item: MenuItem) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-700"
    >
      <p className="text-sm mb-2">{translate(item.description, language)}</p>
      {item.allergens && item.allergens.length > 0 && (
        <p className="text-xs text-red-500 mb-2">
          <strong>{translate(translations.allergens, language)}:</strong> {item.allergens.join(', ')}
        </p>
      )}
      <button
        onClick={() => setExpandedItem(null)}
        className="mt-3 text-primary hover:underline text-sm"
      >
        {translate(translations.close, language)}
      </button>
    </motion.div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        {translate(translations.menuTitle, language)}
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        {translate(translations.menuSubtitle, language)}
      </p>

      {menu.map((category: MenuCategory) => (
        <div key={category.id} className="mb-8 last:mb-0">
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="w-7 h-7 text-primary" />
            <h3 className="text-2xl font-bold text-gray-900">{translate(category.name, language)}</h3>
            {'description' in category && (category as any).description && (
              <span className="text-sm text-gray-500 italic ml-2 hidden sm:block">
                ({translate((category as any).description, language)})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.items.length > 0 ? (
              category.items.map((item: MenuItem) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <Image
                    src={item.image}
                    alt={translate(item.name, language)}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-semibold text-gray-900">{translate(item.name, language)}</h4>
                      <span className="text-primary text-xl font-bold ml-4">€{item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.popular && (
                        <span className="flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" /> {translate(translations.popular, language)}
                        </span>
                      )}
                      {'chefRecommend' in item && item.chefRecommend && (
                        <span className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          <ChefHat className="w-3 h-3" /> {translate(translations.chefRecommend, language)}
                        </span>
                      )}
                      {'sunsetSpecial' in item && item.sunsetSpecial && (
                        <span className="flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" /> {translate(translations.sunsetSpecial, language)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{translate(item.description, language)}</p>
                    <button
                      onClick={() => {
                        addToCart(item)
                      }}
                      className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {translate(translations.addToCart, language)}
                    </button>
                    <AnimatePresence>
                      {expandedItem === item.id && renderItemDetails(item)}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                <Info className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{translate(translations.noItems, language)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

