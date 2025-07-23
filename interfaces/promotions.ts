import type { Ecommerce } from './ecommerces'
import type { Program } from './program'

export interface Promotion {
  id: number
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

export interface PromotionHistory {
  id: number
  ecommerce_id: number
  program_id: number
  current_value: string
  previous_value: string
  created_at: string
  updated_at: string
  ecommerce: Ecommerce
  program: Program
}

export interface PromotionHistoryResponse {
  [programId: string]: PromotionHistory[]
}

export interface PromotionHistoryChartData {
  date: string
  value: number
  program: string
  programColor: string
}
