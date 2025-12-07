/**
 * Página da Mesa - Menu Direto
 * Mobile-First, carregamento instantâneo, multilíngue
 * 
 * Quando turista escaneia QR da mesa → entra direto no menu
 */

'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, FileText, Home, Clock, Globe, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useTableSession } from '@/modules/qr-table-system/hooks/useTableSession'
import { useCallWaiter } from '@/modules/qr-table-system/hooks/useCallWaiter'
import { formatTableNumber } from '@/modules/qr-table-system/utils/tableHelpers'
import { TableMenuWithCart, useCart } from '@/components/menu/TableMenuWithCart'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { DJMode } from '@/components/dj/DJMode'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { CompletePaymentCheckout } from '@/components/payment/CompletePaymentCheckout'

// Componente interno que tem acesso ao CartContext
function MesaPageContent({ tableId }: { tableId: string }) {
  const { language, isReady } = useLanguage()
  const [showActions, setShowActions] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const { cart } = useCart()

  // Usar hooks modulares
  const {
    table,
    isActive,
    sessionDurationFormatted,
  } = useTableSession({ tableId, autoStart: true })

  const {
    callStatus,
    billStatus,
    callWaiter,
    requestBill,
  } = useCallWaiter({
    tableId,
    onSuccess: () => {
      // Feedback visual já está no componente
    },
    onError: (error) => {
      console.error('Error:', error)
    },
  })

  // Calcular total do carrinho
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasItems = cart.length > 0

  // Criar orderId único para pagamento
  const handleRequestPayment = async () => {
    if (!hasItems) return

    // Criar um orderId único baseado na mesa e timestamp
    const newOrderId = `TABLE_${tableId}_${Date.now()}`
    setOrderId(newOrderId)
    setShowPayment(true)
  }

  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {translate(
              { pt: 'Mesa não encontrada', es: 'Mesa no encontrada', en: 'Table not found' },
              language
            )}
          </h1>
          <Link href="/" className="text-yellow-500 hover:text-yellow-400">
            {translate(
              { pt: 'Voltar ao início', es: 'Volver al inicio', en: 'Back to home' },
              language
            )}
          </Link>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Simples - Logo + Texto da Mesa */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="text-center">
            {/* Logo */}
            <Link href="/" className="inline-block mb-2">
              <span className="text-2xl font-bold text-yellow-500">Sofia</span>
            </Link>
            
            {/* Texto da Mesa */}
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">
              {translate(
                { pt: 'Sofia Gastrobar Ibiza', es: 'Sofia Gastrobar Ibiza', en: 'Sofia Gastrobar Ibiza' },
                language
              )}
            </p>
            <h1 className="text-xl font-semibold text-zinc-100 mb-1">
              {translate(
                { pt: 'Você está na mesa', es: 'Estás en la mesa', en: 'You are at table' },
                language
              )} {formatTableNumber(table)}
            </h1>
            <p className="text-sm text-zinc-400">
              {translate(
                { pt: 'Veja o menu, faça seu pedido, chame o garçom quando quiser.', es: 'Ver el menú, hacer tu pedido, llamar al camarero cuando quieras.', en: 'View the menu, place your order, call the waiter when you need.' },
                language
              )}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Botões de Ação Rápidos - Logo após Header */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Ver Menu da Mesa - Já está visível abaixo, mas botão para scroll */}
          <button
            onClick={() => {
              const menuElement = document.getElementById('table-menu')
              menuElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/50 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl transition-all"
          >
            <FileText className="w-5 h-5 inline mr-2" />
            {translate(
              { pt: 'Ver Menu da Mesa', es: 'Ver Menú de la Mesa', en: 'View Table Menu' },
              language
            )}
          </button>

          {/* Chamar Garçom */}
          <button
            onClick={callWaiter}
            disabled={callStatus === 'calling'}
            className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-yellow-500/50 transition-all disabled:opacity-50"
          >
            <Bell className="w-5 h-5 inline mr-2" />
            {callStatus === 'calling' 
              ? translate({ pt: 'Chamando...', es: 'Llamando...', en: 'Calling...' }, language)
              : callStatus === 'success'
              ? translate({ pt: 'Chamado!', es: '¡Llamado!', en: 'Called!' }, language)
              : translate({ pt: 'Chamar Garçom', es: 'Llamar Camarero', en: 'Call Waiter' }, language)
            }
          </button>

          {/* Pedir Conta */}
          <button
            onClick={requestBill}
            disabled={billStatus === 'calling'}
            className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 hover:border-yellow-500/50 transition-all disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5 inline mr-2" />
            {billStatus === 'calling'
              ? translate({ pt: 'Solicitando...', es: 'Solicitando...', en: 'Requesting...' }, language)
              : billStatus === 'success'
              ? translate({ pt: 'Solicitada!', es: '¡Solicitada!', en: 'Requested!' }, language)
              : translate({ pt: 'Pedir Conta', es: 'Pedir Cuenta', en: 'Request Bill' }, language)
            }
          </button>
        </div>
      </div>

      {/* Menu Direto - Sem página intermediária */}
      <div id="table-menu" className="max-w-2xl mx-auto pb-24">
        {/* Menu dentro do CartProvider */}
        <TableMenuWithCart tableId={tableId} />
        
        {/* Modo DJ - Integrado na experiência da mesa */}
        <div className="px-4 mt-8">
          <DJMode tableId={tableId} />
        </div>

        {/* Payment Checkout */}
        <AnimatePresence>
          {showPayment && orderId && cartTotal > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 mt-8 mb-8"
            >
              <CompletePaymentCheckout
                amount={cartTotal}
                currency="EUR"
                description={`Conta Mesa ${formatTableNumber(table)} – Pedido ${orderId.slice(-6)}`}
                orderId={orderId}
                orderType="table"
                redirectUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/mesa/${tableId}/pago?order_id=${orderId}&status=paid`}
                onSuccess={() => {
                  setShowPayment(false)
                  setTimeout(() => {
                    window.location.href = `/mesa/${tableId}/pago?order_id=${orderId}&status=paid`
                  }, 2000)
                }}
                onError={(error) => {
                  console.error('Payment error:', error)
                }}
                language={language}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão Fixo de Pagamento (apenas quando há itens no carrinho) */}
      {hasItems && !showPayment && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50"
        >
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  {translate({ pt: 'Total', es: 'Total', en: 'Total' }, language)}
                </p>
                <p className="text-2xl font-bold text-yellow-500">
                  €{cartTotal.toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleRequestPayment}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/50 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl transition-all"
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                {translate({ pt: 'Pagar Conta', es: 'Pagar Cuenta', en: 'Pay Bill' }, language)}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Componente wrapper que fornece o CartProvider
export default function MesaPage() {
  const params = useParams()
  const tableId = params.id as string

  return (
    <TableMenuWithCart tableId={tableId}>
      <MesaPageContent tableId={tableId} />
    </TableMenuWithCart>
  )
}
