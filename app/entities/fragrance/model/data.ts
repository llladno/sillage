import type { Fragrance } from '~/entities/fragrance/model/types'
import type { Locale } from '~/shared/config/i18n'

const NOTES: Record<Locale, Fragrance['notes']> = {
  en: {
    top: ['bergamot', 'pink pepper', 'cold-metal accord'],
    heart: ['iris', 'black tea', 'damask rose'],
    base: ['vetiver', 'ambrette', 'papyrus', 'incense'],
  },
  fr: {
    top: ['bergamote', 'poivre rose', 'accord métal froid'],
    heart: ['iris', 'thé noir', 'rose de Damas'],
    base: ['vétiver', 'ambrette', 'papyrus', 'encens'],
  },
}

const CONCEPT: Record<Locale, string> = {
  en: 'The smell of a letter you never sent.',
  fr: 'L’odeur d’une lettre jamais envoyée.',
}

const SIZES: Record<Locale, Fragrance['sizes']> = {
  en: [
    { id: 'ml50', label: '50 ml', priceEur: 180 },
    { id: 'ml100', label: '100 ml', priceEur: 260 },
    { id: 'ml10', label: '10 ml discovery', priceEur: 35 },
  ],
  fr: [
    { id: 'ml50', label: '50 ml', priceEur: 180 },
    { id: 'ml100', label: '100 ml', priceEur: 260 },
    { id: 'ml10', label: '10 ml découverte', priceEur: 35 },
  ],
}

export const getFragrance = (locale: Locale): Fragrance => ({
  edition: 'SILLAGE 01',
  name: 'Encre',
  concept: CONCEPT[locale],
  notes: NOTES[locale],
  sizes: SIZES[locale],
})
