export interface Airport {
  _id: string
  name: string
  country: string
  iataCode: string
}

export interface AirportSearchResponse {
  limit: number
  totalCount: number
  totalPages: number
  page: number
  items: Airport[]
}

export interface FlightProgram {
  id: number
  name: string
  logo_url: string
  link_url: string
  type: string
  value_per_mile: number
}

export interface FlightSearchResult {
  id: number
  program: FlightProgram
  stops: number
  departure_datetime: string
  arrival_datetime: string
  price: number
  created_at: string
  updated_at: string
  airline: string
}

export interface FlightSearchResponse {
  data: FlightSearchResult[]
}

export interface FlightSearchHistory {
  id: number
  origin: string
  destination: string
  departure_date: string
  created_at: string
  updated_at: string
}

export interface FlightSearchHistoryResponse {
  data: FlightSearchHistory[]
}

export interface FlightSearchFilters {
  origin: string
  destination: string
  departure_date: string
}