'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Users, Phone, Mail, Home, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useUserData } from '@/hooks/useUserData'
import { UserDataAutoFill } from '@/components/ui/UserDataAutoFill'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { PaymentCheckout } from '@/components/payment/PaymentCheckout'

export default function ReservasPage() {
  const { language, isReady } = useLanguage()
  const { userData, loading: userDataLoading, updateUserData } = useUserData({ autoLoad: true })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [reservationId, setReservationId] = useState<string | null>(null)
  const [paymentLinkId, setPaymentLinkId] = useState<string | null>(null)
  const [prepaidAmount, setPrepaidAmount] = useState(0)

  // Preencher dados do usuário automaticamente
  useEffect(() => {
    if (userData && !userDataLoading) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
      }))
    }
  }, [userData, userDataLoading])

  // Salvar dados quando formulário é enviado
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Salvar dados do usuário
    updateUserData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    })

    // Continuar com o submit original
    handleSubmit(e)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Criar reserva
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests, 10),
          specialRequests: formData.specialRequests || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar reserva')
      }

      // 2. Calcular valor do pagamento (6€ por pessoa)
      const numberOfPeople = parseInt(formData.guests, 10)
      const amount = numberOfPeople * 6

      // 3. Criar link de pagamento SumUp
      const paymentResponse = await fetch('/api/sumup/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'reservation',
          reservationId: data.id,
          numberOfPeople,
          date: formData.date,
          time: formData.time,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Erro ao criar link de pagamento')
      }

      // 4. Mostrar tela de pagamento
      setReservationId(data.id)
      setPaymentLinkId(paymentData.paymentLink.id)
      setPrepaidAmount(amount)
      setShowPayment(true)
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error creating reservation:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'Erro ao criar reserva. Tente novamente.')
    }
  }

  if (!isReady) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-semibold">Voltar ao Início</span>
          </Link>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Reservar <span className="text-yellow-500">Mesa</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Garanta seu lugar no Sofia Gastrobar. Reservas recomendadas especialmente para jantares e eventos especiais.
          </p>
        </motion.div>

        {/* Payment Checkout */}
        <AnimatePresence>
          {showPayment && paymentLinkId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <PaymentCheckout
                amount={prepaidAmount}
                description={`Reserva Sofia Gastrobar – ${formData.date} ${formData.time} – ${formData.guests} pessoa${parseInt(formData.guests) > 1 ? 's' : ''}`}
                paymentLinkId={paymentLinkId}
                onSuccess={() => {
                  setShowPayment(false)
                  setIsSuccess(true)
                  setTimeout(() => {
                    window.location.href = `/reservas/confirmacao?reservation_id=${reservationId}&status=paid`
                  }, 2000)
                }}
                onError={(error) => {
                  alert(error)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {isSuccess && !showPayment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-8 bg-green-500/20 border border-green-500/50 rounded-2xl p-6 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Reserva Confirmada!</h3>
              <p className="text-white/80">
                Enviaremos uma confirmação por e-mail e WhatsApp em breve.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleFormSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {translate({ pt: 'Dados da Reserva', es: 'Datos de la Reserva', en: 'Reservation Details' }, language)}
            </h3>
                    <UserDataAutoFill
                      onFill={(data: { name?: string; email?: string; phone?: string }) => {
                        setFormData(prev => ({
                          ...prev,
                          name: data.name || prev.name,
                          email: data.email || prev.email,
                          phone: data.phone || prev.phone,
                        }))
                      }}
                    />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                {translate({ pt: 'Nome Completo', es: 'Nombre Completo', en: 'Full Name' }, language)} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder={translate({ pt: 'Seu nome', es: 'Tu nombre', en: 'Your name' }, language)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                {translate({ pt: 'E-mail', es: 'E-mail', en: 'Email' }, language)} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                {translate({ pt: 'Telefone', es: 'Teléfono', en: 'Phone' }, language)} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Número de Pessoas *
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num} className="bg-zinc-900">
                    {num} {num === 1 ? 'pessoa' : 'pessoas'}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Data *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Horário *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Pedidos Especiais (opcional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
              placeholder="Alergias, preferências, ocasião especial..."
            />
          </div>

          {/* Info sobre pagamento */}
          {!showPayment && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm font-medium mb-2">
                💳 Reserva Paga - 6€ por pessoa
              </p>
              <p className="text-white/70 text-xs">
                Para confirmar sua reserva, cobramos 6€ por pessoa. Este valor será totalmente descontado da sua conta no momento do consumo.
              </p>
              <p className="text-white/60 text-xs mt-2">
                Valor estimado: <span className="font-bold text-yellow-400">€{parseInt(formData.guests || '2') * 6}</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          {!showPayment && (
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
            >
              {isSubmitting ? 'Criando Reserva...' : `Confirmar e Pagar €${parseInt(formData.guests || '2') * 6} Agora`}
            </button>
          )}

          <p className="text-white/50 text-sm text-center mt-4">
            * Campos obrigatórios. A reserva só será confirmada após o pagamento.
          </p>
        </motion.form>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
          >
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Horários</h3>
            <p className="text-white/70 text-sm">
              1º Maio - 1º Out: 08h - 01h<br />
              Março, Out, Nov: 12h - 01h
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
          >
            <Phone className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Contato Direto</h3>
            <p className="text-white/70 text-sm">
              +34 611 48 77 73<br />
              <a href="https://wa.me/34611487773" className="text-yellow-500 hover:text-yellow-400">
                WhatsApp
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
          >
            <Users className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Grupos</h3>
            <p className="text-white/70 text-sm">
              Para grupos maiores que 10 pessoas,<br />
              entre em contato diretamente
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

