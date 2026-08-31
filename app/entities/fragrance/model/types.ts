export type NoteTier = 'top' | 'heart' | 'base'

export type SizeId = 'ml50' | 'ml100' | 'ml10'

export type Size = { id: SizeId; label: string; priceEur: number }

export type Fragrance = {
  edition: string
  name: string
  concept: string
  notes: Record<NoteTier, string[]>
  sizes: Size[]
}
