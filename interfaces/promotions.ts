import type { Ecommerce } from './ecommerces'
import type { Program } from './program'

export interface Promotion {
  current_value: number
  program: Program
  ecommerce: Ecommerce
  updated_at: string
  promotion_link: string
}

export interface PromotionMetaLink {
  url: string | null
  label: string
  active: boolean
}

export interface PromotionMeta {
  current_page: number
  from: number
  last_page: number
  links: PromotionMetaLink[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface PromotionResponseDTO {
  data: Promotion[]
  meta: PromotionMeta
}
