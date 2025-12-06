/**
 * Página Sobre - A Lenda de Sofia
 * Conteúdo emocional e artístico sobre o gastrobar
 */

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Home, MapPin, Clock, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translate } from '@/lib/i18n'

const translations = {
  title: {
    pt: 'A Lenda de Sofia',
    es: 'La Leyenda de Sofia',
    en: 'The Legend of Sofia',
  },
  subtitle: {
    pt: 'Um refúgio para quem procura sabor, beleza e presença',
    es: 'Un refugio para quienes buscan sabor, belleza y presencia',
    en: 'A refuge for those seeking flavor, beauty and presence',
  },
  legendTitle: {
    pt: 'A História',
    es: 'La Historia',
    en: 'The Story',
  },
  legend1: {
    pt: 'Diz a lenda que Sofia, uma viajante do tempo e do espírito, chegou à ilha guiada por Tânit. Adormeceu entre estrelas e acordou com um propósito:',
    es: 'Cuenta la leyenda que Sofia, una viajera del tiempo y del espíritu, llegó a la isla guiada por Tânit. Se durmió entre estrellas y despertó con un propósito:',
    en: 'Legend has it that Sofia, a traveler of time and spirit, arrived on the island guided by Tânit. She fell asleep among stars and awoke with a purpose:',
  },
  legendQuote: {
    pt: 'Criar um lugar onde todos pudessem celebrar a vida.',
    es: 'Crear un lugar donde todos pudieran celebrar la vida.',
    en: 'Create a place where everyone could celebrate life.',
  },
  legend2: {
    pt: 'O gastrobar nasceu desse encontro: um templo leve, onde o prazer e a sabedoria se abraçam. Onde as mesas servem de altar e a música é reza.',
    es: 'El gastrobar nació de ese encuentro: un templo ligero, donde el placer y la sabiduría se abrazan. Donde las mesas sirven de altar y la música es oración.',
    en: 'The gastrobar was born from this encounter: a light temple, where pleasure and wisdom embrace. Where tables serve as altars and music is prayer.',
  },
  missionTitle: {
    pt: 'Nossa Missão',
    es: 'Nuestra Misión',
    en: 'Our Mission',
  },
  mission: {
    pt: 'Oferecer uma experiência gastronômica única que combina sabores mediterrâneos, energia balear e tecnologia inteligente. Criar momentos mágicos onde cada visita é uma celebração.',
    es: 'Ofrecer una experiencia gastronómica única que combina sabores mediterráneos, energía balear y tecnología inteligente. Crear momentos mágicos donde cada visita es una celebración.',
    en: 'To offer a unique gastronomic experience that combines Mediterranean flavors, Balearic energy and smart technology. Create magical moments where every visit is a celebration.',
  },
  visionTitle: {
    pt: 'Nossa Visão',
    es: 'Nuestra Visión',
    en: 'Our Vision',
  },
  vision: {
    pt: 'Ser o gastrobar mais preparado de Ibiza, onde tecnologia e humanidade se encontram para criar experiências inesquecíveis.',
    es: 'Ser el gastrobar más preparado de Ibiza, donde la tecnología y la humanidad se encuentran para crear experiencias inolvidables.',
    en: 'To be the most prepared gastrobar in Ibiza, where technology and humanity meet to create unforgettable experiences.',
  },
  valuesTitle: {
    pt: 'Nossos Valores',
    es: 'Nuestros Valores',
    en: 'Our Values',
  },
  value1: {
    pt: 'Magia - Acreditamos no poder transformador da experiência',
    es: 'Magia - Creemos en el poder transformador de la experiencia',
    en: 'Magic - We believe in the transformative power of experience',
  },
  value2: {
    pt: 'Fogo - Paixão em cada prato, em cada momento',
    es: 'Fuego - Pasión en cada plato, en cada momento',
    en: 'Fire - Passion in every dish, in every moment',
  },
  value3: {
    pt: 'Sabor - Qualidade e autenticidade em cada receita',
    es: 'Sabor - Calidad y autenticidad en cada receta',
    en: 'Flavor - Quality and authenticity in every recipe',
  },
  locationTitle: {
    pt: 'Localização',
    es: 'Ubicación',
    en: 'Location',
  },
  address: {
    pt: 'Carrer des Caló, 109, Sant Agustí des Vedrà, 07829, Ibiza',
    es: 'Carrer des Caló, 109, Sant Agustí des Vedrà, 07829, Ibiza',
    en: 'Carrer des Caló, 109, Sant Agustí des Vedrà, 07829, Ibiza',
  },
  hoursTitle: {
    pt: 'Horários',
    es: 'Horarios',
    en: 'Hours',
  },
  hours1: {
    pt: '1º Maio - 1º Outubro: 08h - 01h',
    es: '1º Mayo - 1º Octubre: 08h - 01h',
    en: 'May 1st - October 1st: 08:00 - 01:00',
  },
  hours2: {
    pt: 'Março, Outubro, Novembro: 12h - 01h',
    es: 'Marzo, Octubre, Noviembre: 12h - 01h',
    en: 'March, October, November: 12:00 - 01:00',
  },
  contactTitle: {
    pt: 'Contato',
    es: 'Contacto',
    en: 'Contact',
  },
  phone: {
    pt: '+34 611 48 77 73',
    es: '+34 611 48 77 73',
    en: '+34 611 48 77 73',
  },
  email: {
    pt: 'info@sofiagastrobaribiza.com',
    es: 'info@sofiagastrobaribiza.com',
    en: 'info@sofiagastrobaribiza.com',
  },
  backToHome: {
    pt: 'Voltar ao Início',
    es: 'Volver al Inicio',
    en: 'Back to Home',
  },
}

export default function SobrePage() {
  const { language, isReady } = useLanguage()

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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {translate(translations.title, language)}
          </h1>
          <p className="text-white/70 text-xl max-w-3xl mx-auto">
            {translate(translations.subtitle, language)}
          </p>
        </motion.div>

        {/* Legend Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 mb-16 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-yellow-500 mb-6">
              {translate(translations.legendTitle, language)}
            </h2>
            <div className="space-y-4 text-lg text-white/80 leading-relaxed">
              <p>{translate(translations.legend1, language)}</p>
              <p className="italic text-yellow-400 border-l-4 border-yellow-500 pl-4 py-2 bg-white/5 rounded-r-lg">
                "{translate(translations.legendQuote, language)}"
              </p>
              <p>{translate(translations.legend2, language)}</p>
            </div>
          </div>
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border-4 border-yellow-500/20">
            <Image
              src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1887&auto=format&fit=crop"
              alt="A lenda de Sofia"
              fill
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 bg-purple-900/30 mix-blend-overlay" />
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">
              {translate(translations.missionTitle, language)}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {translate(translations.mission, language)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">
              {translate(translations.visionTitle, language)}
            </h2>
            <p className="text-white/80 leading-relaxed">
              {translate(translations.vision, language)}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-yellow-500 mb-8 text-center">
            {translate(translations.valuesTitle, language)}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-white/80">{translate(translations.value1, language)}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🔥</div>
              <p className="text-white/80">{translate(translations.value2, language)}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-white/80">{translate(translations.value3, language)}</p>
            </div>
          </div>
        </motion.div>

        {/* Location & Contact */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {translate(translations.locationTitle, language)}
            </h2>
            <p className="text-white/80 mb-6">{translate(translations.address, language)}</p>
            <a
              href="https://maps.google.com/?q=Carrer+des+Caló+109+Sant+Agustí+des+Vedrà+Ibiza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 underline"
            >
              Ver no Google Maps
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              {translate(translations.hoursTitle, language)}
            </h2>
            <p className="text-white/80 mb-2">{translate(translations.hours1, language)}</p>
            <p className="text-white/80">{translate(translations.hours2, language)}</p>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-yellow-500 mb-6">
            {translate(translations.contactTitle, language)}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href={`tel:${translate(translations.phone, language)}`}
              className="flex items-center gap-2 text-white/80 hover:text-yellow-500 transition-colors"
            >
              <Phone className="w-5 h-5" />
              {translate(translations.phone, language)}
            </a>
            <a
              href={`mailto:${translate(translations.email, language)}`}
              className="flex items-center gap-2 text-white/80 hover:text-yellow-500 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {translate(translations.email, language)}
            </a>
            <a
              href="https://wa.me/34611487773"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-yellow-500 transition-colors"
            >
              <Phone className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

