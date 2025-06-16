export interface SearchRecord {
  data: {
    id: number
    name: string | null
    search_term: string | null
    created_at: string // ISO datetime string
    updated_at: string // ISO datetime string
  }
}
