/**
 * Helpers para menu inteligente por horário
 */

import menuData from '@/data/menu.json'

export type MenuCategory = typeof menuData.categories[0]
export type MenuItem = MenuCategory['items'][0]

/**
 * Retorna categorias ativas baseado no horário atual
 */
export function getActiveCategoriesByTime(hour: number): MenuCategory[] {
  return menuData.categories.filter(category => {
    const { start, end } = category.timeRange
    if (start <= end) {
      // Horário normal (ex: 8h - 12h)
      return hour >= start && hour < end
    } else {
      // Horário que cruza meia-noite (ex: 17h - 1h)
      return hour >= start || hour < end
    }
  })
}

/**
 * Retorna categoria destacada baseado no horário
 */
export function getHighlightedCategory(hour: number): MenuCategory | null {
  // Café da manhã: 8h - 12h
  if (hour >= 8 && hour < 12) {
    return menuData.categories.find(c => c.id === 'breakfast') || null
  }
  
  // Almoço: 12h - 17h
  if (hour >= 12 && hour < 17) {
    return menuData.categories.find(c => c.id === 'tapas') || null
  }
  
  // Jantar/Tapas: 17h - 1h
  if (hour >= 17 || hour < 1) {
    return menuData.categories.find(c => c.id === 'tapas') || null
  }
  
  return null
}

/**
 * Retorna itens mais populares
 */
export function getPopularItems(): MenuItem[] {
  const allItems: MenuItem[] = []
  menuData.categories.forEach(category => {
    category.items.forEach(item => {
      if ('popular' in item && item.popular) {
        allItems.push(item)
      }
    })
  })
  return allItems
}

/**
 * Retorna recomendações do chef
 */
export function getChefRecommendations(): MenuItem[] {
  const allItems: MenuItem[] = []
  menuData.categories.forEach(category => {
    category.items.forEach(item => {
      if ('chefRecommend' in item && item.chefRecommend) {
        allItems.push(item)
      }
    })
  })
  return allItems
}

/**
 * Retorna itens especiais de sunset
 */
export function getSunsetSpecials(): MenuItem[] {
  const allItems: MenuItem[] = []
  menuData.categories.forEach(category => {
    category.items.forEach(item => {
      if ('sunsetSpecial' in item && item.sunsetSpecial) {
        allItems.push(item)
      }
    })
  })
  return allItems
}

/**
 * Retorna hora atual
 */
export function getCurrentHour(): number {
  return new Date().getHours()
}

