export interface NotificationData {
  program_name?: string
  ecommerce_name?: string
  current_value?: string
  program_id?: number
  ecommerce_id?: number
  program_type?: 'points' | 'miles'
  ecommerce_category?: string
  // Para alertas de mudança de preço
  product_name?: string
  product_image?: string
  old_price?: number
  new_price?: number
  search_id?: number
}

export interface Notification {
  id: string
  type: string
  notifiable_type: string
  notifiable_id: number
  data: NotificationData
  read_at: string | null
  created_at: string
  updated_at: string
}

export interface NotificationsResponse {
  current_page: number
  data: Notification[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}
