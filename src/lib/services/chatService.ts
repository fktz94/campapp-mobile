import { apiClient } from '../api/client'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export async function fetchChatMessages() {
  return await apiClient.get<ChatMessage[]>('/chat')
}

export async function sendChatMessage(message: string) {
  return apiClient.post<{ reply: string }>('/chat/message', { message })
}
