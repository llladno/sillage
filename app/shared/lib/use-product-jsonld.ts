import { getFragrance } from '~/entities/fragrance/model/data'
import type { Locale } from '~/shared/config/i18n'

const RELEASE_YEAR = '2026'

export const useProductJsonld = () => {
  const { locale } = useI18n()
  // useSiteConfig() resolves to the configured absolute site URL, so the JSON-LD
  // stays correct in the static build (useRequestURL would bake in the
  // prerender host).
  const site = useSiteConfig()
  const route = useRoute()
  const fragrance = getFragrance(locale.value as Locale)
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${fragrance.edition} — ${fragrance.name}`,
    category: 'Perfume',
    url: `${site.url}${route.path}`,
    image: `${site.url}/og/default.png`,
    releaseDate: RELEASE_YEAR,
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
