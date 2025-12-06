/**
 * Payment Status Component
 * Exibe status do pagamento
 */

'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface PaymentStatusProps {
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  message?: string
}

export function PaymentStatus({ status, message }: PaymentStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      title: 'Pagamento Pendente',
      defaultMessage: 'Aguardando confirmação do pagamento...',
    },
    paid: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      title: 'Pagamento Confirmado!',
      defaultMessage: 'Seu pagamento foi processado com sucesso.',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      title: 'Pagamento Falhou',
      defaultMessage: 'Não foi possível processar o pagamento. Tente novamente.',
    },
    expired: {
      icon: AlertCircle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      title: 'Link Expirado',
      defaultMessage: 'O link de pagamento expirou. Por favor, gere um novo.',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      title: 'Pagamento Cancelado',
      defaultMessage: 'O pagamento foi cancelado.',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-6 text-center`}
    >
      <Icon className={`w-16 h-16 ${config.color} mx-auto mb-4`} />
      <h3 className={`text-2xl font-bold ${config.color} mb-2`}>
        {config.title}
      </h3>
      <p className="text-white/70">
        {message || config.defaultMessage}
      </p>
    </motion.div>
  )
}

