export interface ChatMessage {
  id: number
  content: string
  role: 'user' | 'assistant'
  created_at: string
  updated_at: string
}

export interface FlightChat {
  id: number
  messages: ChatMessage[]
  prompt: string
  response: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed' | null
}

export interface FlightChatResponse {
  data: FlightChat
}

export interface CreateChatPayload {
  message: string
}

export interface AddMessagePayload {
  message: string
}
