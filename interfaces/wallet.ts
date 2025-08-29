import type { Program } from './program'

export interface WalletAccount {
  id: number
  program: Program
  balance: number
  created_at: string
  updated_at: string
}

export interface WalletAccountsResponseDTO {
  data: WalletAccount[]
}

export interface CreateWalletAccountDTO {
  balance: number
  program_id: number
}

export interface WalletSummary {
  totalPoints: number
  totalMiles: number
}
