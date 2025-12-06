/**
 * Hook para Geolocalização
 * Obtém localização precisa do usuário
 */

import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  onSuccess?: (position: GeolocationPosition) => void
  onError?: (error: GeolocationPositionError) => void
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    onSuccess,
    onError,
  } = options

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  })

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalização não suportada pelo navegador',
        loading: false,
      }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newState = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        }
        setState(newState)
        if (onSuccess) onSuccess(position)
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível'
            break
          case error.TIMEOUT:
            errorMessage = 'Tempo de espera esgotado'
            break
        }
        const newState = {
          latitude: null,
          longitude: null,
          accuracy: null,
          error: errorMessage,
          loading: false,
        }
        setState(newState)
        if (onError) onError(error)
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    )
  }

  return {
    ...state,
    getCurrentPosition,
  }
}

/**
 * Hook para obter endereço a partir de coordenadas (Reverse Geocoding)
 */
export function useReverseGeocoding(latitude: number | null, longitude: number | null) {
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!latitude || !longitude) {
      setAddress(null)
      return
    }

    setLoading(true)
    setError(null)

    // Usar Google Geocoding API (requer API key)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      // Fallback: usar Nominatim (OpenStreetMap) - gratuito mas limitado
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SofiaGastrobar/1.0',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.address) {
            const addr = data.address
            const fullAddress = [
              addr.road,
              addr.house_number,
              addr.postcode,
              addr.city || addr.town || addr.village,
              addr.country,
            ]
              .filter(Boolean)
              .join(', ')
            setAddress(fullAddress)
          } else {
            setError('Endereço não encontrado')
          }
          setLoading(false)
        })
        .catch((err) => {
          setError('Erro ao obter endereço')
          setLoading(false)
        })
    } else {
      // Usar Google Geocoding API
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=pt`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted_address)
          } else {
            setError('Endereço não encontrado')
          }
          setLoading(false)
        })
        .catch((err) => {
          setError('Erro ao obter endereço')
          setLoading(false)
        })
    }
  }, [latitude, longitude])

  return { address, loading, error }
}

