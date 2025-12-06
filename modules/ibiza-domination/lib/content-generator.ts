/**
 * Content Generator - Dominação Ibérica 1.0™
 * Geração automática de conteúdo dinâmico
 */

export interface DynamicContent {
  date: string
  weather?: string
  sunset?: string
  special?: string
  menuHighlight?: string
}

/**
 * Gera conteúdo dinâmico baseado em data, clima e contexto
 */
export function generateDynamicContent(language: 'pt' | 'es' | 'en' = 'pt'): DynamicContent {
  const today = new Date()
  const hour = today.getHours()
  const month = today.getMonth() + 1

  // Determinar estação
  const season = month >= 6 && month <= 8 ? 'summer' : 
                 month >= 9 && month <= 11 ? 'autumn' :
                 month >= 12 || month <= 2 ? 'winter' : 'spring'

  // Conteúdo por horário
  const timeContent = hour >= 8 && hour < 12 ? {
    pt: 'Perfeito para um brunch completo',
    es: 'Perfecto para un brunch completo',
    en: 'Perfect for a complete brunch',
  } : hour >= 12 && hour < 17 ? {
    pt: 'Hora ideal para almoçar',
    es: 'Hora ideal para almorzar',
    en: 'Ideal time for lunch',
  } : hour >= 17 && hour < 21 ? {
    pt: 'Momento perfeito para tapas e drinks',
    es: 'Momento perfecto para tapas y drinks',
    en: 'Perfect time for tapas and drinks',
  } : {
    pt: 'Noite perfeita para jantar e música',
    es: 'Noche perfecta para cenar y música',
    en: 'Perfect night for dinner and music',
  }

  // Conteúdo sazonal
  const seasonalContent = {
    summer: {
      pt: 'Verão em Ibiza: Sunset perfeito, cocktails refrescantes e música ao vivo',
      es: 'Verano en Ibiza: Sunset perfecto, cócteles refrescantes y música en vivo',
      en: 'Summer in Ibiza: Perfect sunset, refreshing cocktails and live music',
    },
    autumn: {
      pt: 'Outono em Ibiza: Temperatura perfeita para jantares ao ar livre',
      es: 'Otoño en Ibiza: Temperatura perfecta para cenas al aire libre',
      en: 'Autumn in Ibiza: Perfect temperature for outdoor dinners',
    },
    winter: {
      pt: 'Inverno em Ibiza: Comfort food e ambiente acolhedor',
      es: 'Invierno en Ibiza: Comfort food y ambiente acogedor',
      en: 'Winter in Ibiza: Comfort food and welcoming atmosphere',
    },
    spring: {
      pt: 'Primavera em Ibiza: Clima leve e pratos frescos',
      es: 'Primavera en Ibiza: Clima ligero y platos frescos',
      en: 'Spring in Ibiza: Light climate and fresh dishes',
    },
  }

  // Calcular horário do sunset (aproximado para Ibiza)
  const sunsetHour = calculateSunsetHour(month)

  return {
    date: today.toISOString().split('T')[0],
    weather: seasonalContent[season][language],
    sunset: {
      pt: `Sunset hoje às ${sunsetHour}h - Reserve sua mesa com vista`,
      es: `Sunset hoy a las ${sunsetHour}h - Reserva tu mesa con vista`,
      en: `Sunset today at ${sunsetHour}pm - Book your table with a view`,
    }[language],
    special: timeContent[language],
    menuHighlight: {
      pt: 'Destaque do dia: Pratos especiais da temporada',
      es: 'Destacado del día: Platos especiales de temporada',
      en: 'Today\'s highlight: Special seasonal dishes',
    }[language],
  }
}

/**
 * Calcula horário aproximado do sunset para Ibiza
 */
function calculateSunsetHour(month: number): number {
  // Aproximação baseada na latitude de Ibiza
  if (month >= 5 && month <= 8) {
    return 20 // Verão: ~20h
  } else if (month >= 3 && month <= 4 || month >= 9 && month <= 10) {
    return 19 // Primavera/Outono: ~19h
  } else {
    return 18 // Inverno: ~18h
  }
}

/**
 * Gera texto de SEO otimizado
 */
export function generateSEOText(
  keyword: string,
  language: 'pt' | 'es' | 'en' = 'pt',
  dynamicContent?: DynamicContent
): string {
  const baseTexts = {
    pt: `Encontre ${keyword} em Ibiza no Sofia Gastrobar. ${dynamicContent?.special || 'A melhor experiência gastronômica da ilha.'} Reserve agora e desfrute de pratos autênticos, ambiente único e atendimento excepcional.`,
    es: `Encuentra ${keyword} en Ibiza en Sofia Gastrobar. ${dynamicContent?.special || 'La mejor experiencia gastronómica de la isla.'} Reserva ahora y disfruta de platos auténticos, ambiente único y atención excepcional.`,
    en: `Find ${keyword} in Ibiza at Sofia Gastrobar. ${dynamicContent?.special || 'The best gastronomic experience on the island.'} Book now and enjoy authentic dishes, unique atmosphere and exceptional service.`,
  }

  return baseTexts[language]
}

