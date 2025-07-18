export type ProgramType = 'cashback' | 'points' | 'miles'

export interface Program {
  id: number
  name: string
  logo_url: string
  link_url: string
  created_at: string
  updated_at: string | null
  value_per_mile?: number
  type: ProgramType
}
export interface ProgramsResponseDTO {
  cashback: Program[];
  miles: Program[];
  points: Program[];
}