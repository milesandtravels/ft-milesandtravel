export interface Ecommerce {
  id: number
  name: string
  logo_url: string
  category: string
}

export interface Product {
  id: number
  name: string
  price: number
  image_url: string
  product_url: string
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
  reviews: number
  rating: string // pode ser convertido para número se necessário
  ecommerce: Ecommerce
  isCustomProduct: boolean
  selected: boolean
}
