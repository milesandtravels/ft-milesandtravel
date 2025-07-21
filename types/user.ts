export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  two_factor_secret: string | null
  two_factor_recovery_codes: string | null
  two_factor_confirmed_at: string | null
  avatar_url: string | null
  terms_accepted_at: string | null
  user_id: string | null
  phone: string | null
  whatsapp_notification_enabled: boolean
  push_notification_enabled: boolean
  telegram_notification_enabled: boolean
  telegram_chat_id: string | null
}
