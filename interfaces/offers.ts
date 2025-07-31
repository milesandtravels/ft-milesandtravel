import type { Ecommerce } from './ecommerces'
import type { Program, ProgramType } from './program'

export interface OfferListResponse {
  data: OfferItem[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: PaginationLink[]
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
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
  thumbnails: string
}

export interface OfferItem {
  id: string
  ecommerce: Ecommerce
  product: Product
  program_type: ProgramType
  program: Program
  current_value: number
  custom_current_value: number | null
  custom_final_price: number | null
  custom_discount_percentage: number | null
  custom_reward_value: number | null
  selected: boolean
  final_price: string
  discount_percentage: string
  reward_value: string
  created_at: string
  updated_at: string
  promotion_link?: string
}

export interface OffersApiResponse {
  data: OfferItem[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: PaginationLink[]
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface OfferFilters {
  ecommerces: number[]
  products: number[]
  miles_programs: number[]
  points_programs: number[]
  cashback_programs: number[]
  program_types: ProgramType[]
}

export interface OfferSortOptions {
  field: 'price' | 'rating' | 'discount' | 'reward'
  direction: 'asc' | 'desc'
}

export interface OfferStats {
  totalOffers: number
  averageDiscount: number
  topEcommerce: string
  totalCashbackValue: number
  totalPointsValue: number
}
