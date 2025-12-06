/**
 * Structured Data (Schema.org) para SEO
 * Restaurant schema completo para Google
 */

'use client'

import Script from 'next/script'

export function StructuredData() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Sofia Gastrobar Ibiza",
    "image": "https://sofiagastrobaribiza.com/logo.png",
    "description": "Um refúgio para quem procura sabor, beleza e presença. Onde o sagrado e o profano dançam juntos.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrer des Caló, 109",
      "addressLocality": "Sant Agustí des Vedrà",
      "addressRegion": "Illes Balears",
      "postalCode": "07829",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.9833",
      "longitude": "1.2833"
    },
    "url": "https://sofiagastrobaribiza.com",
    "telephone": "+34611487773",
    "priceRange": "€€",
    "servesCuisine": ["Mediterranean", "Tapas", "Gastrobar"],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "01:00",
        "validFrom": "2025-05-01",
        "validThrough": "2025-10-01"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "12:00",
        "closes": "01:00",
        "validFrom": "2025-03-01",
        "validThrough": "2025-05-01"
      }
    ],
    "menu": "https://sofiagastrobaribiza.com/cardapio",
    "acceptsReservations": "True",
    "reservations": "https://sofiagastrobaribiza.com/reservas",
    "sameAs": [
      "https://www.instagram.com/sofia_gastrobar_ibiza/",
      "https://sofiagastrobaribiza.com"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  }

  return (
    <Script
      id="restaurant-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
    />
  )
}

