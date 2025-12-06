/**
 * Helpers para Localização e Zonas de Ibiza
 * Detecta zona automaticamente baseado em coordenadas
 */

export interface Zone {
  id: string
  name: string
  fee: number
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export const IBIZA_ZONES: Zone[] = [
  {
    id: 'sant-antoni',
    name: 'Sant Antoni de Portmany',
    fee: 3.00,
    bounds: {
      north: 38.99,
      south: 38.94,
      east: 1.32,
      west: 1.28,
    },
  },
  {
    id: 'ibiza-town',
    name: 'Ibiza Town / Eivissa',
    fee: 5.00,
    bounds: {
      north: 38.92,
      south: 38.88,
      east: 1.45,
      west: 1.40,
    },
  },
  {
    id: 'san-jose',
    name: 'Sant Josep',
    fee: 4.00,
    bounds: {
      north: 38.92,
      south: 38.88,
      east: 1.28,
      west: 1.22,
    },
  },
  {
    id: 'santa-eulalia',
    name: 'Santa Eulària',
    fee: 6.00,
    bounds: {
      north: 38.99,
      south: 38.94,
      east: 1.55,
      west: 1.50,
    },
  },
]

/**
 * Detecta a zona de Ibiza baseado em coordenadas
 */
export function detectZone(latitude: number, longitude: number): Zone | null {
  for (const zone of IBIZA_ZONES) {
    const { bounds } = zone
    if (
      latitude >= bounds.south &&
      latitude <= bounds.north &&
      longitude >= bounds.west &&
      longitude <= bounds.east
    ) {
      return zone
    }
  }
  return null
}

/**
 * Calcula distância entre dois pontos (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Coordenadas do Sofia Gastrobar
 */
export const SOFIA_LOCATION = {
  latitude: 38.9667,
  longitude: 1.2994,
}

/**
 * Calcula distância do endereço até o Sofia
 */
export function getDistanceFromSofia(latitude: number, longitude: number): number {
  return calculateDistance(
    SOFIA_LOCATION.latitude,
    SOFIA_LOCATION.longitude,
    latitude,
    longitude
  )
}

/**
 * Determina taxa de entrega baseado na distância
 */
export function calculateDeliveryFee(distanceKm: number): number {
  // Até 5km: €3
  if (distanceKm <= 5) return 3.0
  // 5-10km: €5
  if (distanceKm <= 10) return 5.0
  // 10-15km: €6
  if (distanceKm <= 15) return 6.0
  // Mais de 15km: €8
  return 8.0
}

/**
 * Calcula tempo de entrega estimado baseado na distância
 * Retorna em minutos
 */
export function calculateDeliveryTime(distanceKm: number): number {
  // Tempo base: 15 minutos (preparação)
  const baseTime = 15
  
  // Tempo de viagem: ~2 minutos por km (moto em Ibiza)
  const travelTime = Math.ceil(distanceKm * 2)
  
  // Tempo total
  return baseTime + travelTime
}

/**
 * Retorna tempo de entrega formatado (ex: "25-30 min")
 */
export function formatDeliveryTime(minutes: number): string {
  // Adicionar margem de ±5 minutos
  const minTime = Math.max(15, minutes - 5)
  const maxTime = minutes + 5
  
  if (minTime === maxTime) {
    return `${minTime} min`
  }
  
  return `${minTime}-${maxTime} min`
}

/**
 * Zonas de entrega com tempos estimados
 */
export interface DeliveryZone {
  id: string
  name: { pt: string; es: string; en: string }
  fee: number
  minTime: number // minutos
  maxTime: number // minutos
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'sant-antoni',
    name: {
      pt: 'Sant Antoni de Portmany',
      es: 'Sant Antoni de Portmany',
      en: 'Sant Antoni de Portmany',
    },
    fee: 3.00,
    minTime: 20,
    maxTime: 30,
    bounds: {
      north: 38.99,
      south: 38.94,
      east: 1.32,
      west: 1.28,
    },
  },
  {
    id: 'ibiza-town',
    name: {
      pt: 'Ibiza Town / Eivissa',
      es: 'Ibiza Town / Eivissa',
      en: 'Ibiza Town / Eivissa',
    },
    fee: 5.00,
    minTime: 25,
    maxTime: 35,
    bounds: {
      north: 38.92,
      south: 38.88,
      east: 1.45,
      west: 1.40,
    },
  },
  {
    id: 'san-jose',
    name: {
      pt: 'Sant Josep',
      es: 'Sant Josep',
      en: 'Sant Josep',
    },
    fee: 4.00,
    minTime: 22,
    maxTime: 32,
    bounds: {
      north: 38.92,
      south: 38.88,
      east: 1.28,
      west: 1.22,
    },
  },
  {
    id: 'santa-eulalia',
    name: {
      pt: 'Santa Eulària',
      es: 'Santa Eulària',
      en: 'Santa Eulària',
    },
    fee: 6.00,
    minTime: 30,
    maxTime: 40,
    bounds: {
      north: 38.99,
      south: 38.94,
      east: 1.55,
      west: 1.50,
    },
  },
  {
    id: 'san-joan',
    name: {
      pt: 'Sant Joan de Labritja',
      es: 'Sant Joan de Labritja',
      en: 'Sant Joan de Labritja',
    },
    fee: 7.00,
    minTime: 35,
    maxTime: 45,
    bounds: {
      north: 39.08,
      south: 39.02,
      east: 1.52,
      west: 1.45,
    },
  },
  {
    id: 'other',
    name: {
      pt: 'Outras áreas da ilha',
      es: 'Otras áreas de la isla',
      en: 'Other island areas',
    },
    fee: 8.00,
    minTime: 40,
    maxTime: 50,
    bounds: {
      north: 39.2,
      south: 38.8,
      east: 1.6,
      west: 1.2,
    },
  },
]

/**
 * Detecta zona de entrega baseado em coordenadas
 */
export function detectDeliveryZone(latitude: number, longitude: number): DeliveryZone | null {
  for (const zone of DELIVERY_ZONES) {
    const { bounds } = zone
    if (
      latitude >= bounds.south &&
      latitude <= bounds.north &&
      longitude >= bounds.west &&
      longitude <= bounds.east
    ) {
      return zone
    }
  }
  return null
}

