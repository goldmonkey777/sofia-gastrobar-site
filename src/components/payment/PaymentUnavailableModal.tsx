/**
 * Modal para quando pagamento online não está disponível
 * Oferece alternativa via WhatsApp com pedido formatado
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, AlertCircle } from 'lucide-react'

interface PaymentUnavailableModalProps {
  isOpen: boolean
  onClose: () => void
  orderDetails?: {
    type: 'delivery' | 'reservation' | 'table'
    items?: Array<{ name: string; quantity: number; price: number }>
    total?: number
    customerName?: string
    customerPhone?: string
    address?: string
    date?: string
    time?: string
    numberOfPeople?: number
    tableId?: string
  }
  language?: 'pt' | 'es' | 'en'
}

const WHATSAPP_NUMBER = '+34611487773'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`

const translations = {
  pt: {
    title: 'Pagamento Online Indisponível',
    message: 'O pagamento online está temporariamente indisponível. Mas não se preocupe! Você pode finalizar seu pedido via WhatsApp.',
    whatsappButton: 'Finalizar via WhatsApp',
    close: 'Fechar',
    orderDetails: 'Detalhes do Pedido',
  },
  es: {
    title: 'Pago Online No Disponible',
    message: 'El pago online está temporalmente no disponible. ¡Pero no te preocupes! Puedes finalizar tu pedido por WhatsApp.',
    whatsappButton: 'Finalizar por WhatsApp',
    close: 'Cerrar',
    orderDetails: 'Detalles del Pedido',
  },
  en: {
    title: 'Online Payment Unavailable',
    message: 'Online payment is temporarily unavailable. But don\'t worry! You can finalize your order via WhatsApp.',
    whatsappButton: 'Finalize via WhatsApp',
    close: 'Close',
    orderDetails: 'Order Details',
  },
}

export function PaymentUnavailableModal({
  isOpen,
  onClose,
  orderDetails,
  language = 'pt',
}: PaymentUnavailableModalProps) {
  const t = translations[language]

  const formatWhatsAppMessage = () => {
    let message = ''

    if (orderDetails?.type === 'delivery') {
      message = `🍽️ *Pedido de Delivery - Sofia Gastrobar*\n\n`
      message += `👤 *Cliente:* ${orderDetails.customerName || 'Cliente'}\n`
      message += `📞 *Telefone:* ${orderDetails.customerPhone || 'Não informado'}\n`
      message += `📍 *Endereço:* ${orderDetails.address || 'Não informado'}\n\n`
      
      if (orderDetails.items && orderDetails.items.length > 0) {
        message += `📋 *Itens:*\n`
        orderDetails.items.forEach(item => {
          message += `• ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}\n`
        })
        message += `\n💰 *Total: €${orderDetails.total?.toFixed(2) || '0.00'}*\n\n`
      }
      
      message += `✅ Gostaria de confirmar este pedido e receber instruções de pagamento.`
    } else if (orderDetails?.type === 'reservation') {
      message = `📅 *Reserva - Sofia Gastrobar*\n\n`
      message += `👤 *Nome:* ${orderDetails.customerName || 'Cliente'}\n`
      message += `📞 *Telefone:* ${orderDetails.customerPhone || 'Não informado'}\n`
      message += `👥 *Pessoas:* ${orderDetails.numberOfPeople || 1}\n`
      message += `📅 *Data:* ${orderDetails.date || 'Não informado'}\n`
      message += `🕐 *Horário:* ${orderDetails.time || 'Não informado'}\n\n`
      message += `💰 *Valor da Reserva: €${orderDetails.total?.toFixed(2) || '0.00'}*\n\n`
      message += `✅ Gostaria de confirmar esta reserva e receber instruções de pagamento.`
    } else if (orderDetails?.type === 'table') {
      message = `🍽️ *Pedido da Mesa ${orderDetails.tableId || 'N/A'} - Sofia Gastrobar*\n\n`
      
      if (orderDetails.items && orderDetails.items.length > 0) {
        message += `📋 *Itens:*\n`
        orderDetails.items.forEach(item => {
          message += `• ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}\n`
        })
        message += `\n💰 *Total: €${orderDetails.total?.toFixed(2) || '0.00'}*\n\n`
      }
      
      message += `✅ Gostaria de finalizar este pedido e receber instruções de pagamento.`
    } else {
      message = `Olá! 👋\n\nGostaria de fazer um pedido no Sofia Gastrobar.`
    }

    return encodeURIComponent(message)
  }

  const handleWhatsAppClick = () => {
    const message = formatWhatsAppMessage()
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-black via-zinc-900 to-black border-2 border-yellow-500/50 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                aria-label={t.close}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-500/20 rounded-full p-4">
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-3">
                {t.title}
              </h2>

              {/* Message */}
              <p className="text-white/70 text-center mb-6">
                {t.message}
              </p>

              {/* Order Details (if available) */}
              {orderDetails && (
                <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                  <h3 className="text-sm font-semibold text-yellow-500 mb-2">
                    {t.orderDetails}
                  </h3>
                  {orderDetails.items && orderDetails.items.length > 0 && (
                    <div className="space-y-1 text-sm text-white/80">
                      {orderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                          <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {orderDetails.total && (
                        <div className="pt-2 mt-2 border-t border-white/10 flex justify-between font-semibold text-yellow-500">
                          <span>Total</span>
                          <span>€{orderDetails.total.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {t.whatsappButton}
              </button>

              {/* Close Button (secondary) */}
              <button
                onClick={onClose}
                className="w-full mt-3 text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

