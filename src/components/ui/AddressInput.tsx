/**
 * AddressInput Component
 * Input inteligente de endereço com:
 * - Google Places Autocomplete
 * - Geolocalização
 * - Integração Apple Maps
 * - Preenchimento automático de dados do telefone
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Loader2, CheckCircle } from 'lucide-react'
import { useGeolocation, useReverseGeocoding } from '@/hooks/useGeolocation'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

interface AddressInputProps {
  value: string
  onChange: (address: string) => void
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void
  placeholder?: string
  required?: boolean
  className?: string
  showGeolocation?: boolean
  showMaps?: boolean
}

const translations = {
  placeholder: {
    pt: 'Digite seu endereço ou use a localização',
    es: 'Escribe tu dirección o usa la ubicación',
    en: 'Enter your address or use location',
  },
  useLocation: {
    pt: 'Usar Minha Localização',
    es: 'Usar Mi Ubicación',
    en: 'Use My Location',
  },
  gettingLocation: {
    pt: 'Obtendo localização...',
    es: 'Obteniendo ubicación...',
    en: 'Getting location...',
  },
  locationError: {
    pt: 'Erro ao obter localização',
    es: 'Error al obtener ubicación',
    en: 'Error getting location',
  },
  openGoogleMaps: {
    pt: 'Abrir no Google Maps',
    es: 'Abrir en Google Maps',
    en: 'Open in Google Maps',
  },
  openAppleMaps: {
    pt: 'Abrir no Apple Maps',
    es: 'Abrir en Apple Maps',
    en: 'Open in Apple Maps',
  },
  addressFound: {
    pt: 'Endereço encontrado!',
    es: '¡Dirección encontrada!',
    en: 'Address found!',
  },
}

export function AddressInput({
  value,
  onChange,
  onLocationChange,
  placeholder,
  required = false,
  className = '',
  showGeolocation = true,
  showMaps = true,
}: AddressInputProps) {
  const { language, isReady } = useLanguage()
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [isUsingLocation, setIsUsingLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
    getCurrentPosition,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
  })

  const { address: reverseAddress, loading: reverseLoading } = useReverseGeocoding(
    latitude,
    longitude
  )

  // Carregar Google Places API
  useEffect(() => {
    if (typeof window === 'undefined' || isGoogleLoaded) return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.warn('Google Maps API key não configurada')
      return
    }

    // Verificar se já está carregado
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsGoogleLoaded(true)
      return
    }

    // Carregar script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${language}`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsGoogleLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup se necessário
    }
  }, [language, isGoogleLoaded])

  // Inicializar Google Places Autocomplete
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'es' }, // Restringir a Espanha (Ibiza)
      fields: ['formatted_address', 'geometry', 'address_components'],
      types: ['address'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onChange(place.formatted_address)
        
        if (place.geometry?.location && onLocationChange) {
          onLocationChange({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
          })
        }
      }
    })

    autocompleteRef.current = autocomplete

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [isGoogleLoaded, onChange, onLocationChange])

  // Quando geolocalização obtém endereço
  useEffect(() => {
    if (reverseAddress && isUsingLocation) {
      onChange(reverseAddress)
      if (latitude && longitude && onLocationChange) {
        onLocationChange({
          lat: latitude,
          lng: longitude,
          address: reverseAddress,
        })
      }
      setIsUsingLocation(false)
    }
  }, [reverseAddress, latitude, longitude, isUsingLocation, onChange, onLocationChange])

  const handleUseLocation = () => {
    setIsUsingLocation(true)
    getCurrentPosition()
  }


  if (!isReady) return null

  const isLoading = geoLoading || reverseLoading
  const hasLocation = latitude && longitude && reverseAddress

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || translate(translations.placeholder, language)}
          required={required}
          className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
          </div>
        )}
        {hasLocation && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {showGeolocation && (
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Navigation className="w-4 h-4" />
            {isLoading
              ? translate(translations.gettingLocation, language)
              : translate(translations.useLocation, language)}
          </button>
        )}

      </div>

      {geoError && (
        <p className="text-red-400 text-sm">{translate(translations.locationError, language)}</p>
      )}
      {hasLocation && !isLoading && (
        <p className="text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {translate(translations.addressFound, language)}
        </p>
      )}
    </div>
  )
}

// Declaração de tipos para Google Maps
declare global {
  interface Window {
    google: typeof google
  }
}

