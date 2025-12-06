/**
 * SEO Landing Page Component
 * Página de SEO otimizada e invisível ao menu
 */

'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { generateDynamicContent, generateSEOText } from '../lib/content-generator'
import { generateStructuredData, generateBreadcrumbs } from '../lib/seo'
import Link from 'next/link'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'

interface SEOLandingPageProps {
  slug: string
  title: { pt: string; es: string; en: string }
  description: { pt: string; es: string; en: string }
  keywords: string[]
  category: string
}

export function SEOLandingPage({
  slug,
  title,
  description,
  keywords,
  category,
}: SEOLandingPageProps) {
  const { language } = useLanguage()
  const dynamicContent = generateDynamicContent(language)

  // Injetar structured data
  useEffect(() => {
    const structuredData = generateStructuredData({
      title: translate(title, language),
      description: translate(description, language),
      keywords,
      category,
      slug,
      language,
    })

    const breadcrumbs = generateBreadcrumbs(slug, translate(title, language))

    // Adicionar ao head
    const script1 = document.createElement('script')
    script1.type = 'application/ld+json'
    script1.text = JSON.stringify(structuredData)
    script1.id = 'structured-data'

    const script2 = document.createElement('script')
    script2.type = 'application/ld+json'
    script2.text = JSON.stringify(breadcrumbs)
    script2.id = 'breadcrumbs'

    document.head.appendChild(script1)
    document.head.appendChild(script2)

    return () => {
      const existing1 = document.getElementById('structured-data')
      const existing2 = document.getElementById('breadcrumbs')
      if (existing1) existing1.remove()
      if (existing2) existing2.remove()
    }
  }, [slug, title, description, keywords, category, language])

  const translations = {
    cta: {
      pt: 'Reserve Agora',
      es: 'Reserva Ahora',
      en: 'Book Now',
    },
    delivery: {
      pt: 'Pedir Delivery',
      es: 'Pedir Delivery',
      en: 'Order Delivery',
    },
    location: {
      pt: 'Localização',
      es: 'Ubicación',
      en: 'Location',
    },
    hours: {
      pt: 'Horário',
      es: 'Horario',
      en: 'Hours',
    },
    contact: {
      pt: 'Contato',
      es: 'Contacto',
      en: 'Contact',
    },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-yellow-900/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {translate(title, language)}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            {translate(description, language)}
          </p>

          {/* Dynamic Content */}
          {dynamicContent.special && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
              <p className="text-yellow-400 font-semibold">
                {dynamicContent.special}
              </p>
              {dynamicContent.sunset && (
                <p className="text-white/70 text-sm mt-2">
                  {dynamicContent.sunset}
                </p>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservas"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all"
            >
              {translate(translations.cta, language)}
            </Link>
            {category === 'delivery' && (
              <Link
                href="/delivery"
                className="bg-white/10 border border-white/20 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/20 transition-all"
              >
                {translate(translations.delivery, language)}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6">
            {translate(title, language)} - Sofia Gastrobar Ibiza
          </h2>
          
          <p className="text-lg text-white/80 mb-6">
            {generateSEOText(keywords[0] || 'restaurante ibiza', language, dynamicContent)}
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            {/* Location */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <MapPin className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {translate(translations.location, language)}
              </h3>
              <p className="text-white/70">
                Ibiza, Illes Balears, Espanha
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <Clock className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {translate(translations.hours, language)}
              </h3>
              <p className="text-white/70">
                08:00 - 01:00 (Todos os dias)
              </p>
            </div>
          </div>

          {/* Keywords Section (invisível para usuário, visível para SEO) */}
          <div className="hidden">
            <p>
              {keywords.join(', ')}. {translate(description, language)}
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-yellow-900/20 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {translate(title, language)} - Reserve Agora
          </h2>
          <p className="text-white/80 mb-8">
            Não perca a melhor experiência gastronômica de Ibiza
          </p>
          <Link
            href="/reservas"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all inline-block"
          >
            {translate(translations.cta, language)}
          </Link>
        </div>
      </section>
    </div>
  )
}


