import { getFragrance } from '~/entities/fragrance/model/data'
import type { Locale } from '~/shared/config/i18n'

export const useProductJsonld = () => {
  const { locale } = useI18n()
  const fragrance = getFragrance(locale.value as Locale)
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${fragrance.edition} — ${fragrance.name}`,
    brand: { '@type': 'Brand', name: 'SILLAGE' },
    description: fragrance.concept,
    offers: fragrance.sizes.map((size) => ({
      '@type': 'Offer',
      name: size.label,
      price: size.priceEur,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    })),
  }
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonld) }],
  })
}
