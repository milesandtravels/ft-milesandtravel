export interface CampaignProgram {
  id: number
  name: string
  logo_url: string
  link_url: string
  type: 'points' | 'miles' | 'cashback'
  value_per_mile: number
}

export interface CampaignItem {
  id: number
  program_origin: CampaignProgram
  program_destination: CampaignProgram
  expiration_date: string
  created_at: string
  updated_at: string
  value: number
  value_type: 'percent' | 'points'
  type:
    | 'bonus_transfer'
    | 'purchase_with_bonus'
    | 'purchase_with_discount'
    | 'club_upgrade'
    | 'club_subscription'
  link_url: string
}

export interface CampaignResponse {
  data: CampaignItem[]
}

export type CampaignType =
  | 'bonus_transfer'
  | 'purchase_with_bonus'
  | 'purchase_with_discount'
  | 'club_upgrade'
  | 'club_subscription'

export interface CampaignTab {
  key: CampaignType
  label: string
  icon: string
}
