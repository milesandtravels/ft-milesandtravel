export interface Ecommerce {
  id: number
  name: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  price: number
  image_url: string
  product_url: string
  created_at: string
  updated_at: string
  reviews: number
  rating: string
  isCustomProduct: boolean
}

export interface Program {
  id: number
  name: string
  logo_url: string | null
  created_at: string
  updated_at: string | null
  value_per_mile?: number
}

export interface OfferItem {
  ecommerce: Ecommerce
  product: Product
  program_type: ProgramType
  program: Program
  current_value_promotion: number
  selected: boolean
  final_price: string
  discount_percentage: string
  reward_value: string
  created_at: string
  updated_at: string
}

export interface OffersApiResponse {
  data: OfferItem[]
}

export type ProgramType = 'cashback' | 'points'

export interface Ecommerce {
  id: number
  name: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  price: number
  image_url: string
  product_url: string
  created_at: string
  updated_at: string
  reviews: number
  rating: string
  isCustomProduct: boolean
}

export interface Program {
  id: number
  name: string
  logo_url: string | null
  created_at: string
  updated_at: string | null
  value_per_mile?: number
}

export interface OfferItem {
  ecommerce: Ecommerce
  product: Product
  program_type: ProgramType
  program: Program
  current_value_promotion: number
  selected: boolean
  final_price: string
  discount_percentage: string
  reward_value: string
  created_at: string
  updated_at: string
}

export interface OffersApiResponse {
  data: OfferItem[]
}

// Tipos auxiliares para filtros e ordenação
export interface OfferFilters {
  programTypes: ProgramType[]
  minPrice?: number
  maxPrice?: number
  ecommerceIds?: number[]
  minRating?: number
}

export interface OfferSortOptions {
  field: 'price' | 'rating' | 'discount' | 'reward'
  direction: 'asc' | 'desc'
}

// Tipo para estatísticas das ofertas
export interface OfferStats {
  totalOffers: number
  averageDiscount: number
  topEcommerce: string
  totalCashbackValue: number
  totalPointsValue: number
}
