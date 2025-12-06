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

