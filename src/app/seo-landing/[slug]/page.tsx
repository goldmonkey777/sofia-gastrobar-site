/**
 * SEO Landing Page - Dynamic Route
 * Páginas de SEO invisíveis ao menu
 * Exemplo: /seo-landing/restaurante-em-ibiza
 */

import { Metadata } from 'next'
import { SEOLandingPage } from '@/modules/ibiza-domination/components/SEOLandingPage'
import seoPagesData from '@/modules/ibiza-domination/data/seo-pages.json'
import { generateSEOMetadata } from '@/modules/ibiza-domination/lib/seo'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return seoPagesData.pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = seoPagesData.pages.find((p) => p.slug === params.slug)

  if (!page) {
    return {
      title: 'Página não encontrada',
    }
  }

  return generateSEOMetadata({
    title: page.title.pt, // Default to PT, can be made dynamic
    description: page.description.pt,
    keywords: page.keywords,
    category: page.category,
    slug: `seo-landing/${params.slug}`,
  })
}

export default function SEOLandingPageRoute({ params }: PageProps) {
  const page = seoPagesData.pages.find((p) => p.slug === params.slug)

  if (!page) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
          <a href="/" className="text-yellow-400 hover:text-yellow-300">
            Voltar ao início
          </a>
        </div>
      </div>
    )
  }

  return (
    <SEOLandingPage
      slug={params.slug}
      title={page.title}
      description={page.description}
      keywords={page.keywords}
      category={page.category}
    />
  )
}

