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
import { Star, Utensils, ChefHat, Info, ShoppingCart, Plus, Minus, Trash, CheckCircle, X, Clock, ChefHat as ChefIcon, Bell } from 'lucide-react'

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
  const [placedOrderData, setPlacedOrderData] = useState<{ id: string; items: CartItem[]; total: number } | null>(null)

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
      setPlacedOrderData({
        id: data.order.id,
        items: [...cart],
        total: subtotal,
      })
      clearCart()
      setIsPlacing(false)

      if (onOrderPlaced) {
        onOrderPlaced(data.order.id)
      }
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

              {orderPlaced && placedOrderData ? (
                <OrderSuccessScreen
                  orderId={placedOrderData.id}
                  items={placedOrderData.items}
                  total={placedOrderData.total}
                  language={language}
                  onClose={() => {
                    setOrderPlaced(false)
                    setPlacedOrderData(null)
                  }}
                />
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

/**
 * Tela de Sucesso do Pedido
 */
function OrderSuccessScreen({
  orderId,
  items,
  total,
  language,
  onClose,
}: {
  orderId: string
  items: CartItem[]
  total: number
  language: 'pt' | 'es' | 'en'
  onClose: () => void
}) {
  const translations = {
    title: {
      pt: 'Pedido Confirmado!',
      es: '¡Pedido Confirmado!',
      en: 'Order Confirmed!',
    },
    subtitle: {
      pt: 'Seu pedido foi enviado para a cozinha',
      es: 'Tu pedido ha sido enviado a la cocina',
      en: 'Your order has been sent to the kitchen',
    },
    orderNumber: {
      pt: 'Pedido #',
      es: 'Pedido #',
      en: 'Order #',
    },
    estimatedTime: {
      pt: 'Tempo estimado',
      es: 'Tiempo estimado',
      en: 'Estimated time',
    },
    minutes: {
      pt: 'minutos',
      es: 'minutos',
      en: 'minutes',
    },
    items: {
      pt: 'Itens do pedido',
      es: 'Ítems del pedido',
      en: 'Order items',
    },
    total: {
      pt: 'Total',
      es: 'Total',
      en: 'Total',
    },
    status: {
      pt: 'Status',
      es: 'Estado',
      en: 'Status',
    },
    preparing: {
      pt: 'Preparando',
      es: 'Preparando',
      en: 'Preparing',
    },
    continueShopping: {
      pt: 'Fazer Outro Pedido',
      es: 'Hacer Otro Pedido',
      en: 'Place Another Order',
    },
    callWaiter: {
      pt: 'Chamar Garçom',
      es: 'Llamar Camarero',
      en: 'Call Waiter',
    },
  }

  // Calcular tempo estimado baseado no número de itens (15-20 min por item)
  const estimatedMinutes = Math.max(15, items.reduce((sum, item) => sum + item.quantity, 0) * 5)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        {/* Success Icon */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {translate(translations.title, language)}
          </h2>
          <p className="text-white/70 text-sm">
            {translate(translations.subtitle, language)}
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-4 mb-6">
          {/* Order Number */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">
                {translate(translations.orderNumber, language)}
              </span>
              <span className="text-yellow-400 font-bold text-lg">
                {orderId.slice(-6).toUpperCase()}
              </span>
            </div>
            
            {/* Estimated Time */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80 text-sm">
                {translate(translations.estimatedTime, language)}: <span className="text-yellow-400 font-semibold">{estimatedMinutes} {translate(translations.minutes, language)}</span>
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 text-sm">
              {translate(translations.items, language)} ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/80">
                    {typeof item.name === 'string' ? item.name : translate(item.name, language)} × {item.quantity}
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-white font-bold">
                {translate(translations.total, language)}:
              </span>
              <span className="text-yellow-400 font-bold text-lg">
                €{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ChefIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
              <div>
                <p className="text-white/60 text-xs mb-1">
                  {translate(translations.status, language)}
                </p>
                <p className="text-yellow-400 font-semibold">
                  {translate(translations.preparing, language)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all"
          >
            {translate(translations.continueShopping, language)}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {translate(translations.callWaiter, language)}
          </button>
        </div>
      </motion.div>
    </motion.div>
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

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item)
    // Feedback visual - poderia adicionar um toast aqui
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {translate(translations.menuTitle, language)}
        </h2>
        <p className="text-white/70 text-sm md:text-base">
          {translate(translations.menuSubtitle, language)}
        </p>
      </div>

      {/* Categories */}
      {menu.map((category: MenuCategory) => (
        <div key={category.id} className="mb-10 last:mb-0">
          {/* Category Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Utensils className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {translate(category.name, language)}
              </h3>
              {'description' in category && (category as any).description && (
                <p className="text-white/60 text-xs md:text-sm mt-1">
                  {translate((category as any).description, language)}
                </p>
              )}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 gap-4">
            {category.items.length > 0 ? (
              category.items.map((item: MenuItem) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={translate(item.name, language)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base md:text-lg font-semibold text-white line-clamp-2">
                          {translate(item.name, language)}
                        </h4>
                        <span className="text-yellow-400 text-lg md:text-xl font-bold flex-shrink-0">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.popular && (
                          <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">
                            <Star className="w-3 h-3" /> {translate(translations.popular, language)}
                          </span>
                        )}
                        {'chefRecommend' in item && item.chefRecommend && (
                          <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                            <ChefHat className="w-3 h-3" /> {translate(translations.chefRecommend, language)}
                          </span>
                        )}
                        {'sunsetSpecial' in item && item.sunsetSpecial && (
                          <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                            <Star className="w-3 h-3" /> {translate(translations.sunsetSpecial, language)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-white/70 text-xs md:text-sm mb-3 line-clamp-2">
                        {translate(item.description, language)}
                      </p>

                      {/* Add Button */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2.5 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{translate(translations.addToCart, language)}</span>
                      </button>
                    </div>
                  </div>

                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="px-4 pb-3 pt-0">
                      <p className="text-[10px] text-white/50">
                        <strong className="text-white/70">{translate(translations.allergens, language)}:</strong>{' '}
                        {item.allergens.join(', ')}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center text-white/50 py-8">
                <Info className="w-12 h-12 mx-auto mb-4 text-white/30" />
                <p className="text-sm">{translate(translations.noItems, language)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

