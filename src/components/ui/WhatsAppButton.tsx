/**
 * WhatsApp Button - Botão fixo para falar com Sofia
 * Integração com WhatsApp Business API (futuro: SofiaGastroBot)
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Home, ShoppingCart, Calendar, Menu as MenuIcon } from 'lucide-react'
import Link from 'next/link'

const WHATSAPP_NUMBER = '+34611487773'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Estou no restaurante',
      action: () => {
        const message = encodeURIComponent('Olá! Estou no restaurante. Qual o número da minha mesa?')
        window.open(`${WHATSAPP_URL}?text=${message}`, '_blank')
        setIsOpen(false)
      },
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: 'Fazer pedido delivery',
      action: () => {
        window.location.href = '/delivery'
        setIsOpen(false)
      },
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Fazer reserva',
      action: () => {
        window.location.href = '/reservas'
        setIsOpen(false)
      },
    },
    {
      icon: <MenuIcon className="w-5 h-5" />,
      label: 'Ver menu',
      action: () => {
        window.location.href = '#menu'
        setIsOpen(false)
      },
    },
  ]

  const handleDirectMessage = () => {
    const message = encodeURIComponent('Olá Sofia! 👋')
    window.open(`${WHATSAPP_URL}?text=${message}`, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center transition-colors group"
        aria-label="Falar com Sofia no WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 right-6 z-50 w-80 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#25D366] to-[#20BA5A] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Sofia Gastrobar</h3>
                    <p className="text-white/90 text-xs">Online agora</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 space-y-2">
                <p className="text-white/60 text-sm mb-3 px-2">Como posso ajudar?</p>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 group"
                  >
                    <div className="text-yellow-500 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <span className="text-white font-medium text-sm">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Direct Message Button */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleDirectMessage}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar diretamente
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

