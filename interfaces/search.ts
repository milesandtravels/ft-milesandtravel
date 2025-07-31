export interface SearchRecord {
  id: number
  name: string | null
  active_filters: any | null
  filters: string
  search_term: string | null
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
}
