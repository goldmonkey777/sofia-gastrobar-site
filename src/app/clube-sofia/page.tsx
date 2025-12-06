'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Gift, Star, Users, Home, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ClubeSofiaPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'pt',
    acceptTerms: false,
    acceptMarketing: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const benefits = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Promoções Exclusivas',
      description: 'Acesso a ofertas especiais e descontos em noites selecionadas',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Eventos Secretos',
      description: 'Convites para eventos exclusivos e experiências VIP',
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'Pontos e Níveis',
      description: 'Ganhe pontos a cada visita e suba de nível no Clube Sofia',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidade',
      description: 'Parte de uma comunidade especial que celebra a vida',
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/clube-sofia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          language: formData.language,
          consentMarketing: formData.acceptMarketing,
          consentTerms: formData.acceptTerms,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar cadastro')
      }

      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          language: 'pt',
          acceptTerms: false,
          acceptMarketing: true,
        })
      }, 3000)
    } catch (error) {
      console.error('Error creating customer:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'Erro ao criar cadastro. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
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
          <div className="inline-block mb-6">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Clube <span className="text-yellow-500">Sofia</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Junte-se à comunidade exclusiva do Sofia Gastrobar. Benefícios, eventos secretos e experiências únicas.
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
            <h3 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Clube Sofia! 👑</h3>
            <p className="text-white/80">
              Enviaremos seus benefícios exclusivos por e-mail e WhatsApp em breve.
            </p>
          </motion.div>
        )}

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-yellow-500 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-white/70 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Cadastre-se Agora
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="Seu nome"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Idioma Preferido
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
              >
                <option value="pt" className="bg-zinc-900">Português</option>
                <option value="es" className="bg-zinc-900">Español</option>
                <option value="en" className="bg-zinc-900">English</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                className="mt-1 w-4 h-4 text-yellow-500 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
              />
              <span className="text-white/70 text-sm">
                Aceito os <a href="#" className="text-yellow-500 hover:text-yellow-400">termos e condições</a> do Clube Sofia *
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptMarketing}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptMarketing: e.target.checked }))}
                className="mt-1 w-4 h-4 text-yellow-500 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
              />
              <span className="text-white/70 text-sm">
                Quero receber promoções exclusivas e novidades do Sofia
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess || !formData.acceptTerms}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
          >
            {isSubmitting ? 'Cadastrando...' : isSuccess ? 'Cadastrado com Sucesso!' : 'Entrar no Clube Sofia 👑'}
          </button>
        </motion.form>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-white/60 text-sm"
        >
          <p>
            Ao se cadastrar, você concorda em fazer parte da comunidade Sofia e receber comunicações especiais.
          </p>
          <p className="mt-2">
            Seus dados são tratados com respeito e cuidado, seguindo nossa política de privacidade.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

