'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Oops! Algo deu errado
        </h1>
        <p className="text-white/60 mb-2">
          {error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
        </p>
        {error.digest && (
          <p className="text-white/40 text-xs mb-6 font-mono">
            ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}

