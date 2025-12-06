'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, ShoppingCart, Home, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { AddressInput } from '@/components/ui/AddressInput'
import { useUserData } from '@/hooks/useUserData'
import { useGeolocation } from '@/hooks/useGeolocation'
import { detectZone, getDistanceFromSofia, calculateDeliveryFee } from '@/lib/locationHelpers'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

export default function DeliveryPage() {
  const { language, isReady } = useLanguage()
  const { userData, loading: userDataLoading } = useUserData({ autoLoad: true })
  const [step, setStep] = useState<'zone' | 'order' | 'checkout'>('zone')
  const [formData, setFormData] = useState({
    zone: '',
    address: '',
    phone: '',
    name: '',
    deliveryTime: 'now' as 'now' | 'scheduled',
    scheduledTime: '',
  })
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Preencher dados do usuário automaticamente
  useEffect(() => {
    if (userData && !userDataLoading) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || prev.name,
        phone: userData.phone || prev.phone,
        address: userData.address || prev.address,
      }))
    }
  }, [userData, userDataLoading])

  // Detectar zona quando localização muda
  useEffect(() => {
    if (location) {
      const zone = detectZone(location.lat, location.lng)
      if (zone) {
        setFormData(prev => ({ ...prev, zone: zone.id }))
      } else {
        // Se não detectar zona, calcular taxa por distância
        const distance = getDistanceFromSofia(location.lat, location.lng)
        const fee = calculateDeliveryFee(distance)
        // Usar zona "other" com taxa calculada
        setFormData(prev => ({ ...prev, zone: 'other' }))
      }
    }
  }, [location])

  const zones = [
    { id: 'sant-antoni', name: 'Sant Antoni de Portmany', fee: 3.00 },
    { id: 'ibiza-town', name: 'Ibiza Town / Eivissa', fee: 5.00 },
    { id: 'san-jose', name: 'Sant Josep', fee: 4.00 },
    { id: 'santa-eulalia', name: 'Santa Eulària', fee: 6.00 },
    { id: 'other', name: 'Outra zona da ilha', fee: 8.00 },
  ]

  const menuItems = [
    { id: '1', name: 'Nachos del Crimen Perfeito', price: 16.00 },
    { id: '2', name: 'Coração Crocante do Brasil', price: 7.00 },
    { id: '3', name: 'Patatas Bravas', price: 9.00 },
    { id: '4', name: 'Signature Burger Sofia', price: 18.00 },
    { id: '5', name: 'Sangria Sofia (1L)', price: 22.00 },
  ]

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
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
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = zones.find(z => z.id === formData.zone)?.fee || 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          address: formData.address,
          zone: formData.zone,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          deliveryTime: formData.deliveryTime,
          scheduledTime: formData.deliveryTime === 'scheduled' ? formData.scheduledTime : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar pedido')
      }

      setIsSubmitting(false)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error creating delivery order:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'Erro ao criar pedido. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <div className="flex items-center gap-2 text-white/80">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)} itens</span>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Delivery para <span className="text-yellow-500">Toda a Ilha</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Leve o sabor do Sofia até você. Entregamos em toda Ibiza com rapidez e cuidado.
          </p>
        </motion.div>

        {/* Success Message */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-green-500/20 border border-green-500/50 rounded-2xl p-6 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Pedido Confirmado!</h3>
            <p className="text-white/80">
              Enviaremos o link de pagamento por WhatsApp em breve.
            </p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Zone Selection */}
            {step === 'zone' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-yellow-500" />
                  Selecione sua Zona
                </h2>
                <div className="space-y-3">
                  {zones.map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, zone: zone.id }))
                        setStep('order')
                      }}
                      className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{zone.name}</span>
                        <span className="text-yellow-500 font-bold">+€{zone.fee.toFixed(2)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Menu Selection */}
            {step === 'order' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {translate({ pt: 'Menu', es: 'Menú', en: 'Menu' }, language)}
                  </h2>
                  <button
                    onClick={() => setStep('zone')}
                    className="text-white/60 hover:text-white text-sm"
                  >
                    ← {translate({ pt: 'Alterar zona', es: 'Cambiar zona', en: 'Change zone' }, language)}
                  </button>
                </div>
                <div className="space-y-4">
                  {menuItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-yellow-500 font-bold">€{item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Checkout Form */}
            {step === 'checkout' && cart.length > 0 && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {translate({ pt: 'Finalizar Pedido', es: 'Finalizar Pedido', en: 'Complete Order' }, language)}
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {translate({ pt: 'Dados de Entrega', es: 'Datos de Entrega', en: 'Delivery Details' }, language)}
                    </h3>
                    <UserDataAutoFill
                      onFill={(data) => {
                        setFormData(prev => ({
                          ...prev,
                          name: data.name || prev.name,
                          phone: data.phone || prev.phone,
                          address: data.address || prev.address,
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {translate({ pt: 'Nome', es: 'Nombre', en: 'Name' }, language)} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500"
                      placeholder={translate({ pt: 'Seu nome', es: 'Tu nombre', en: 'Your name' }, language)}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {translate({ pt: 'Telefone', es: 'Teléfono', en: 'Phone' }, language)} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500"
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {translate({ pt: 'Endereço Completo', es: 'Dirección Completa', en: 'Full Address' }, language)} *
                    </label>
                    <AddressInput
                      value={formData.address}
                      onChange={(address) => setFormData(prev => ({ ...prev, address }))}
                      onLocationChange={(loc) => {
                        setLocation(loc)
                        setFormData(prev => ({ ...prev, address: loc.address }))
                      }}
                      showGeolocation={true}
                      showMaps={true}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Horário de Entrega</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, deliveryTime: 'now' }))}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                          formData.deliveryTime === 'now'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Agora
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, deliveryTime: 'scheduled' }))}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                          formData.deliveryTime === 'scheduled'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Agendar
                      </button>
                    </div>
                    {formData.deliveryTime === 'scheduled' && (
                      <input
                        type="datetime-local"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processando...' : isSuccess ? 'Pedido Confirmado!' : `Confirmar Pedido - €${total.toFixed(2)}`}
                </button>
              </motion.form>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Seu Pedido
              </h3>
              {cart.length === 0 ? (
                <p className="text-white/60 text-sm">Carrinho vazio</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <p className="text-yellow-500 text-xs">€{item.price.toFixed(2)} cada</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded text-white text-sm"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded text-white text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    {formData.zone && (
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>Entrega ({zones.find(z => z.id === formData.zone)?.name})</span>
                        <span>€{deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-yellow-500">€{total.toFixed(2)}</span>
                    </div>
                  </div>
                  {cart.length > 0 && step !== 'checkout' && (
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
                    >
                      Finalizar Pedido
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

