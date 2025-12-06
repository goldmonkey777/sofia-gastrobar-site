/**
 * SEO Utilities - Dominação Ibérica 1.0™
 * Funções para geração de SEO otimizado
 */

import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  category: string
  slug: string
  language?: 'pt' | 'es' | 'en' | 'it' | 'de' | 'fr'
}

/**
 * Gera metadata otimizada para SEO
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    slug,
    language = 'pt',
  } = config

  const url = `https://sofiagastrobaribiza.com/${slug}`
  const siteName = 'Sofia Gastrobar Ibiza'

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: language === 'pt' ? 'pt_PT' : language === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://sofiagastrobaribiza.com/logo.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://sofiagastrobaribiza.com/logo.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'pt': url,
        'es': url.replace('/pt/', '/es/'),
        'en': url.replace('/pt/', '/en/'),
      },
    },
  }
}

/**
 * Gera JSON-LD estruturado para Schema.org
 */
export function generateStructuredData(config: SEOConfig) {
  const { title, description, slug, category } = config

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Sofia Gastrobar Ibiza',
    description,
    url: `https://sofiagastrobaribiza.com/${slug}`,
    image: 'https://sofiagastrobaribiza.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Principal',
      addressLocality: 'Ibiza',
      addressRegion: 'Illes Balears',
      postalCode: '07800',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.9067,
      longitude: 1.4206,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '01:00',
      },
    ],
    servesCuisine: 'Mediterranean',
    priceRange: '€€',
    telephone: '+34-XXX-XXX-XXX',
  }

  // Adicionar schema específico por categoria
  if (category === 'delivery') {
    return {
      ...baseStructuredData,
      '@type': 'FoodEstablishment',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Delivery Menu',
        itemListElement: [],
      },
    }
  }

  if (category === 'sunset') {
    return {
      ...baseStructuredData,
      '@type': 'BarOrPub',
      servesCuisine: 'Cocktails',
    }
  }

  return baseStructuredData
}

/**
 * Gera breadcrumbs estruturados
 */
export function generateBreadcrumbs(slug: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sofiagastrobaribiza.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `https://sofiagastrobaribiza.com/${slug}`,
      },
    ],
  }
}

/**
 * Gera sitemap entry
 */
export function generateSitemapEntry(slug: string, priority: number = 0.8) {
  return {
    url: `https://sofiagastrobaribiza.com/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority,
  }
}

