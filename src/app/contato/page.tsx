/**
 * Página de Contato
 * Formulário de contato e informações
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Phone, Mail, MapPin, Clock, Instagram, Facebook, Send } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

const translations = {
  title: {
    pt: 'Entre em Contato',
    es: 'Póngase en Contacto',
    en: 'Get in Touch',
  },
  subtitle: {
    pt: 'Estamos aqui para você. Fale conosco!',
    es: 'Estamos aquí para ti. ¡Háblanos!',
    en: 'We are here for you. Talk to us!',
  },
  formName: {
    pt: 'Nome',
    es: 'Nombre',
    en: 'Name',
  },
  formEmail: {
    pt: 'Email',
    es: 'Email',
    en: 'Email',
  },
  formPhone: {
    pt: 'Telefone',
    es: 'Teléfono',
    en: 'Phone',
  },
  formMessage: {
    pt: 'Mensagem',
    es: 'Mensaje',
    en: 'Message',
  },
  formSubmit: {
    pt: 'Enviar Mensagem',
    es: 'Enviar Mensaje',
    en: 'Send Message',
  },
  formSending: {
    pt: 'Enviando...',
    es: 'Enviando...',
    en: 'Sending...',
  },
  formSuccess: {
    pt: 'Mensagem enviada com sucesso!',
    es: '¡Mensaje enviado con éxito!',
    en: 'Message sent successfully!',
  },
  contactInfo: {
    pt: 'Informações de Contato',
    es: 'Información de Contacto',
    en: 'Contact Information',
  },
  address: {
    pt: 'Carrer des Caló, 109, Sant Agustí des Vedrà, 07829, Ibiza',
    es: 'Carrer des Caló, 109, Sant Agustí des Vedrà, 07829, Ibiza',
    en: 'Carrer des Caló, 109, Sant Agustí des Vedrà, 07829, Ibiza',
  },
  hours: {
    pt: 'Horários',
    es: 'Horarios',
    en: 'Hours',
  },
  hours1: {
    pt: '1º Maio - 1º Outubro: 08h - 01h',
    es: '1º Mayo - 1º Octubre: 08h - 01h',
    en: 'May 1st - October 1st: 08:00 - 01:00',
  },
  hours2: {
    pt: 'Março, Outubro, Novembro: 12h - 01h',
    es: 'Marzo, Octubre, Noviembre: 12h - 01h',
    en: 'March, October, November: 12:00 - 01:00',
  },
  backToHome: {
    pt: 'Voltar ao Início',
    es: 'Volver al Inicio',
    en: 'Back to Home',
  },
}

export default function ContatoPage() {
  const { language, isReady } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isReady) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Integrar com API de contato ou email service
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-semibold">{translate(translations.backToHome, language)}</span>
          </Link>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Link Rápido para Menu - PRIMEIRO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Link
            href="/cardapio"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/50"
          >
            <span>🍽️</span>
            {translate({ pt: 'Ver Menu Completo', es: 'Ver Menú Completo', en: 'View Full Menu' }, language)}
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {translate(translations.title, language)}
          </h1>
          <p className="text-white/70 text-xl">
            {translate(translations.subtitle, language)}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {translate(translations.formName, language)} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder={translate(translations.formName, language)}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {translate(translations.formEmail, language)} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder={translate(translations.formEmail, language)}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {translate(translations.formPhone, language)}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder={translate(translations.formPhone, language)}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {translate(translations.formMessage, language)} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                  placeholder={translate(translations.formMessage, language)}
                />
              </div>

              {isSuccess ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                  <p className="text-green-500 font-semibold">
                    {translate(translations.formSuccess, language)}
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting
                    ? translate(translations.formSending, language)
                    : translate(translations.formSubmit, language)}
                </button>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-yellow-500 mb-6">
                {translate(translations.contactInfo, language)}
              </h2>
              <div className="space-y-4">
                <a
                  href={`tel:+34611487773`}
                  className="flex items-center gap-3 text-white/80 hover:text-yellow-500 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +34 611 48 77 73
                </a>
                <a
                  href="https://wa.me/34611487773"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-yellow-500 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href="mailto:info@sofiagastrobaribiza.com"
                  className="flex items-center gap-3 text-white/80 hover:text-yellow-500 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@sofiagastrobaribiza.com
                </a>
                <a
                  href="https://maps.google.com/?q=Carrer+des+Caló+109+Sant+Agustí+des+Vedrà+Ibiza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-yellow-500 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  {translate(translations.address, language)}
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                {translate(translations.hours, language)}
              </h2>
              <p className="text-white/80 mb-2">{translate(translations.hours1, language)}</p>
              <p className="text-white/80">{translate(translations.hours2, language)}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-yellow-500 mb-6">Redes Sociais</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/sofia_gastrobar_ibiza/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-yellow-500 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/sofiagastrobaribiza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-yellow-500 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                  Facebook
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

