/**
 * Menu Direto para Mesa - Mobile-First
 * Carregamento instantâneo, fotos grandes, multilíngue
 */

'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Clock, Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'
import menuData from '@/data/menu.json'
import { getCurrentHour, getHighlightedCategory, getPopularItems, getChefRecommendations } from '@/lib/menuHelpers'
import type { MenuCategory, MenuItem } from '@/lib/menuHelpers'

interface TableMenuProps {
  tableId: string
}

export function TableMenu({ tableId }: TableMenuProps) {
  const { language, isReady } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const currentHour = getCurrentHour()
  const highlightedCategory = getHighlightedCategory(currentHour)
  const popularItems = getPopularItems()
  const chefRecommendations = getChefRecommendations()

  // Filtrar categorias ativas por horário
  const activeCategories = useMemo(() => {
    return menuData.categories.filter(category => {
      const { start, end } = category.timeRange
      if (start <= end) {
        return currentHour >= start && currentHour < end
      } else {
        return currentHour >= start || currentHour < end
      }
    })
  }, [currentHour])

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-white/60">Carregando menu...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header com horário e idioma */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          <span>
            {currentHour >= 8 && currentHour < 12 && '☕ Café da Manhã'}
            {currentHour >= 12 && currentHour < 17 && '🍽️ Almoço'}
            {(currentHour >= 17 || currentHour < 1) && '🌅 Jantar & Tapas'}
          </span>
        </div>
      </div>

      {/* Destaques - Mais Pedidos */}
      {popularItems.length > 0 && (
        <div className="mb-8 px-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">
              {translate({ pt: 'Mais Pedidos', es: 'Más Pedidos', en: 'Most Popular' }, language)}
            </h2>
          </div>
          <div className="grid gap-4">
            {popularItems.slice(0, 3).map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                language={language}
                isExpanded={expandedItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recomendações do Chef */}
      {chefRecommendations.length > 0 && (
        <div className="mb-8 px-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">
              {translate({ pt: 'Chef Recomenda', es: 'Chef Recomienda', en: 'Chef Recommends' }, language)}
            </h2>
          </div>
          <div className="grid gap-4">
            {chefRecommendations.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                language={language}
                isExpanded={expandedItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                chefRecommend
              />
            ))}
          </div>
        </div>
      )}

      {/* Categorias por Horário */}
      {activeCategories.map(category => (
        <div key={category.id} className="mb-8 px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            {translate(category.name, language)}
            {highlightedCategory?.id === category.id && (
              <span className="ml-2 text-yellow-500 text-lg">⭐</span>
            )}
          </h2>
          <div className="grid gap-4">
            {category.items.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                language={language}
                isExpanded={expandedItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  language: 'pt' | 'es' | 'en'
  isExpanded: boolean
  onToggle: () => void
  chefRecommend?: boolean
}

function MenuItemCard({ item, language, isExpanded, onToggle, chefRecommend }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all"
    >
      {/* Imagem grande */}
      <div className="relative w-full h-48 bg-zinc-800">
        {item.image ? (
          <Image
            src={item.image}
            alt={translate(item.name, language)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            🍽️
          </div>
        )}
        {chefRecommend && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Chef
          </div>
        )}
        {'popular' in item && item.popular && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" />
            Popular
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white flex-1 pr-2">
            {translate(item.name, language)}
          </h3>
          <div className="text-yellow-500 font-bold text-xl whitespace-nowrap">
            €{item.price.toFixed(2)}
          </div>
        </div>

        <p className="text-white/70 text-sm mb-3 line-clamp-2">
          {translate(item.description, language)}
        </p>

        {/* Alérgenos */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.allergens.map(allergen => (
              <span
                key={allergen}
                className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}

        {/* Botão expandir */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Menos detalhes</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Ver detalhes</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Detalhes expandidos */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <p className="text-white/80 text-sm leading-relaxed">
                {translate(item.description, language)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

