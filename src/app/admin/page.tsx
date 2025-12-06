/**
 * Página Admin - ChefIApp OS Bridge
 * Dashboard interno para gerenciamento
 * 
 * NOTA: Esta é uma estrutura básica. Em produção, adicionar:
 * - Autenticação (NextAuth.js)
 * - Permissões (gerente, dono, staff)
 * - WebSockets para tempo real
 * - Integração ChefIApp OS
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Bell, ShoppingCart, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

const translations = {
  title: {
    pt: 'Painel Administrativo',
    es: 'Panel Administrativo',
    en: 'Admin Dashboard',
  },
  unauthorized: {
    pt: 'Acesso não autorizado',
    es: 'Acceso no autorizado',
    en: 'Unauthorized access',
  },
  pendingCalls: {
    pt: 'Chamadas Pendentes',
    es: 'Llamadas Pendientes',
    en: 'Pending Calls',
  },
  activeOrders: {
    pt: 'Pedidos Ativos',
    es: 'Pedidos Activos',
    en: 'Active Orders',
  },
  todayReservations: {
    pt: 'Reservas de Hoje',
    es: 'Reservas de Hoy',
    en: "Today's Reservations",
  },
  stats: {
    pt: 'Estatísticas',
    es: 'Estadísticas',
    en: 'Statistics',
  },
  backToHome: {
    pt: 'Voltar ao Início',
    es: 'Volver al Inicio',
    en: 'Back to Home',
  },
  noData: {
    pt: 'Nenhum dado disponível',
    es: 'No hay datos disponibles',
    en: 'No data available',
  },
}

export default function AdminPage() {
  const { language, isReady } = useLanguage()
  const [pendingCalls, setPendingCalls] = useState<any[]>([])
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [todayReservations, setTodayReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implementar autenticação
    // Por enquanto, apenas carrega dados
    loadData()
    
    // Polling para atualizar dados (em produção, usar WebSockets)
    const interval = setInterval(loadData, 10000) // Atualiza a cada 10 segundos
    
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      // Carregar chamadas pendentes
      const callsRes = await fetch('/api/garcom')
      if (callsRes.ok) {
        const callsData = await callsRes.json()
        setPendingCalls(callsData.pendingCalls || [])
      }

      // TODO: Carregar pedidos ativos
      // TODO: Carregar reservas de hoje

      setLoading(false)
    } catch (error) {
      console.error('Error loading admin data:', error)
      setLoading(false)
    }
  }

  if (!isReady) return null

  // TODO: Verificar autenticação
  // Por enquanto, mostra página básica

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-semibold">{translate(translations.backToHome, language)}</span>
            </Link>
            <h1 className="text-2xl font-bold">{translate(translations.title, language)}</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-white">{pendingCalls.length}</span>
            </div>
            <p className="text-white/60 text-sm">{translate(translations.pendingCalls, language)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-white">{activeOrders.length}</span>
            </div>
            <p className="text-white/60 text-sm">{translate(translations.activeOrders, language)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-white">{todayReservations.length}</span>
            </div>
            <p className="text-white/60 text-sm">{translate(translations.todayReservations, language)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-white">-</span>
            </div>
            <p className="text-white/60 text-sm">{translate(translations.stats, language)}</p>
          </motion.div>
        </div>

        {/* Pending Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-yellow-500" />
            {translate(translations.pendingCalls, language)}
          </h2>
          {loading ? (
            <div className="text-center py-8 text-white/60">Carregando...</div>
          ) : pendingCalls.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              {translate(translations.noData, language)}
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCalls.map((call: any) => (
                <div
                  key={call.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      Mesa {call.tableId} - {call.action === 'call' ? '🔔 Chamar Garçom' : '💳 Pedir Conta'}
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(call.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                    Atender
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-500 mb-2">Admin Dashboard - Versão Básica</h3>
            <p className="text-white/80 text-sm">
              Esta é uma versão básica do painel administrativo. Em produção, adicionar:
            </p>
            <ul className="text-white/60 text-sm mt-2 list-disc list-inside space-y-1">
              <li>Autenticação e autorização</li>
              <li>Integração completa com ChefIApp OS</li>
              <li>WebSockets para atualizações em tempo real</li>
              <li>Gerenciamento de pedidos e reservas</li>
              <li>Analytics e relatórios</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

