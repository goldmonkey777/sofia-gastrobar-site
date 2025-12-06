/**
 * Página Cardápio - Menu Público Completo
 * Para turistas e QR externo
 */

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Home, Utensils, Clock, Star, ChefHat, Filter } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import { getCurrentHour, getFilteredMenuByTime, type MenuItem, type MenuCategory } from '@/lib/menuHelpers'

const translations = {
  title: {
    pt: 'Cardápio Completo',
    es: 'Menú Completo',
    en: 'Full Menu',
  },
  subtitle: {
    pt: 'Sabores que encantam, a qualquer hora do dia',
    es: 'Sabores que encantan, a cualquier hora del día',
    en: 'Enchanting flavors, any time of day',
  },
  filterAll: {
    pt: 'Todos',
    es: 'Todos',
    en: 'All',
  },
  popular: {
    pt: 'Popular',
    es: 'Popular',
    en: 'Popular',
  },
  chefRecommend: {
    pt: 'Chef Recomenda',
    es: 'Recomendación del Chef',
    en: "Chef's Pick",
  },
  sunsetSpecial: {
    pt: 'Especial Sunset',
    es: 'Especial Sunset',
    en: 'Sunset Special',
  },
  allergens: {
    pt: 'Alérgenos',
    es: 'Alérgenos',
    en: 'Allergens',
  },
  backToHome: {
    pt: 'Voltar ao Início',
    es: 'Volver al Inicio',
    en: 'Back to Home',
  },
}

export default function CardapioPage() {
  const { language, isReady } = useLanguage()
  const currentHour = getCurrentHour()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const menu = getFilteredMenuByTime(currentHour)

  // Get all categories for filter
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    menu.forEach(cat => categories.add(cat.id))
    return Array.from(categories)
  }, [menu])

  // Filter menu by selected category
  const filteredMenu = useMemo(() => {
    if (!selectedCategory) return menu
    return menu.filter(cat => cat.id === selectedCategory)
  }, [menu, selectedCategory])

  if (!isReady) return null

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

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {translate(translations.title, language)}
          </h1>
          <p className="text-white/70 text-xl">
            {translate(translations.subtitle, language)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {currentHour >= 8 && currentHour < 12 && '☕ Café da Manhã'}
              {currentHour >= 12 && currentHour < 17 && '🍽️ Almoço'}
              {(currentHour >= 17 || currentHour < 1) && '🌅 Jantar & Tapas'}
            </span>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              !selectedCategory
                ? 'bg-yellow-500 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {translate(translations.filterAll, language)}
          </button>
          {allCategories.map((catId: string) => {
            const category = menu.find((c: MenuCategory) => c.id === catId)
            if (!category) return null
            return (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === catId
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {translate(category.name, language)}
              </button>
            )
          })}
        </motion.div>

        {/* Menu Categories */}
        <div className="space-y-16">
          {filteredMenu.map((category: MenuCategory) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <Utensils className="w-8 h-8 text-yellow-500" />
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {translate(category.name, language)}
                  </h2>
                  {'description' in category && (category as any).description && (
                    <p className="text-white/60 mt-1">
                      {translate((category as any).description, language)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item: MenuItem) => (
                  <MenuItemCard key={item.id} item={item} language={language} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MenuItemCard({ item, language }: { item: MenuItem; language: 'pt' | 'es' | 'en' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all"
    >
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={translate(item.name, language)}
          fill
          className="object-cover"
          quality={85}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {item.popular && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              {translate(translations.popular, language)}
            </span>
          )}
          {'chefRecommend' in item && item.chefRecommend && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <ChefHat className="w-3 h-3" />
              {translate(translations.chefRecommend, language)}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{translate(item.name, language)}</h3>
          <span className="text-yellow-500 text-xl font-bold">€{item.price.toFixed(2)}</span>
        </div>
        <p className="text-white/70 text-sm mb-3">{translate(item.description, language)}</p>
        {item.allergens && item.allergens.length > 0 && (
          <p className="text-xs text-red-400">
            <strong>{translate(translations.allergens, language)}:</strong> {item.allergens.join(', ')}
          </p>
        )}
      </div>
    </motion.div>
  )
}
