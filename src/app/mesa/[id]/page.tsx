'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, FileText, XCircle, Home, Menu, Gamepad2, Music } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { getTableById } from '@/lib/tables'

export default function MesaPage() {
  const params = useParams()
  const tableId = params.id as string
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle')
  const [billStatus, setBillStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle')

  const table = getTableById(tableId)

  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Mesa não encontrada</h1>
          <Link href="/" className="text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  const handleCallWaiter = async () => {
    setCallStatus('calling')

    try {
      const response = await fetch('/api/garcom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, action: 'call' }),
      })

      if (response.ok) {
        setCallStatus('success')
        setTimeout(() => setCallStatus('idle'), 3000)
      } else {
        setCallStatus('error')
        setTimeout(() => setCallStatus('idle'), 3000)
      }
    } catch (error) {
      setCallStatus('error')
      setTimeout(() => setCallStatus('idle'), 3000)
    }
  }

  const handleRequestBill = async () => {
    setBillStatus('requesting')

    try {
      const response = await fetch('/api/garcom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, action: 'bill' }),
      })

      if (response.ok) {
        setBillStatus('success')
        setTimeout(() => setBillStatus('idle'), 3000)
      } else {
        setBillStatus('error')
        setTimeout(() => setBillStatus('idle'), 3000)
      }
    } catch (error) {
      setBillStatus('error')
      setTimeout(() => setBillStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Sofia</span>
            </Link>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Mesa {table.number}</div>
              <div className="text-sm text-gray-600">{table.location}</div>
            </div>
            <div className="text-sm text-gray-500">{table.capacity} pessoas</div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Sofia Gastrobar! 👋
          </h1>
          <p className="text-gray-600">
            Use os botões abaixo para chamar o garçom, pedir a conta ou explorar nosso menu.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid gap-4 mb-6">
          {/* Call Waiter */}
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleCallWaiter}
            disabled={callStatus === 'calling'}
            className={`
              bg-gradient-to-r from-primary to-primary/80 text-white
              rounded-xl p-6 shadow-lg
              flex items-center gap-4
              hover:shadow-xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${callStatus === 'success' ? 'bg-green-500' : ''}
              ${callStatus === 'error' ? 'bg-red-500' : ''}
            `}
          >
            <Bell className={`w-8 h-8 ${callStatus === 'calling' ? 'animate-bounce' : ''}`} />
            <div className="text-left flex-1">
              <div className="text-xl font-bold">
                {callStatus === 'calling' && 'Chamando...'}
                {callStatus === 'success' && 'Garçom chamado!'}
                {callStatus === 'error' && 'Erro. Tente novamente'}
                {callStatus === 'idle' && 'Chamar Garçom'}
              </div>
              <div className="text-sm opacity-90">
                {callStatus === 'idle' && 'Estamos a caminho!'}
                {callStatus === 'success' && 'Chegaremos em instantes'}
              </div>
            </div>
          </motion.button>

          {/* Request Bill */}
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleRequestBill}
            disabled={billStatus === 'requesting'}
            className={`
              bg-gradient-to-r from-accent to-accent/80 text-white
              rounded-xl p-6 shadow-lg
              flex items-center gap-4
              hover:shadow-xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${billStatus === 'success' ? 'bg-green-500' : ''}
              ${billStatus === 'error' ? 'bg-red-500' : ''}
            `}
          >
            <FileText className={`w-8 h-8 ${billStatus === 'requesting' ? 'animate-pulse' : ''}`} />
            <div className="text-left flex-1">
              <div className="text-xl font-bold">
                {billStatus === 'requesting' && 'Solicitando...'}
                {billStatus === 'success' && 'Conta solicitada!'}
                {billStatus === 'error' && 'Erro. Tente novamente'}
                {billStatus === 'idle' && 'Pedir a Conta'}
              </div>
              <div className="text-sm opacity-90">
                {billStatus === 'idle' && 'Prepararemos sua conta'}
                {billStatus === 'success' && 'Levaremos em breve'}
              </div>
            </div>
          </motion.button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/cardapio"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all block text-center"
            >
              <Menu className="w-12 h-12 mx-auto mb-3 text-secondary" />
              <div className="font-bold text-lg text-gray-900">Cardápio</div>
              <div className="text-sm text-gray-600">Ver menu completo</div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/jogo"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all block text-center"
            >
              <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <div className="font-bold text-lg text-gray-900">Mini-Jogo</div>
              <div className="text-sm text-gray-600">A Ilha de Sofia</div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/dj"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all block text-center"
            >
              <Music className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <div className="font-bold text-lg text-gray-900">Modo DJ</div>
              <div className="text-sm text-gray-600">Música ambiente</div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="/"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all block text-center"
            >
              <Home className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <div className="font-bold text-lg text-gray-900">Início</div>
              <div className="text-sm text-gray-600">Página principal</div>
            </Link>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-600 text-sm"
        >
          <p>Escaneie o QR code da sua mesa a qualquer momento</p>
          <p className="mt-2 text-xs text-gray-500">
            Mesa {table.number} • {table.location} • {table.capacity} pessoas
          </p>
        </motion.div>
      </div>
    </div>
  )
}
