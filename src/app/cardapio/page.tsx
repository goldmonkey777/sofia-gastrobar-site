'use client'

import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function CardapioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Home className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">🍽️ Cardápio</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold mb-4">Menu Completo em Breve!</h2>
          <p className="text-gray-600 mb-8">
            Estamos finalizando nosso cardápio digital interativo.<br />
            Por enquanto, peça ao garçom para ver todas as opções deliciosas!
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Voltar ao Início
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
