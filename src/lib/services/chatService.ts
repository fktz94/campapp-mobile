import { apiClient } from '../api/client'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export async function fetchChatMessages(after?: string) {
  const query = after ? `?after=${after}` : ''
  const res = await apiClient.get<{ messages: ChatMessage[]; hasMore: boolean }>(`/chat${query}`)
  return res
}

export async function sendChatMessage(message: string) {
  return apiClient.post<{ reply: string }>('/chat/message', { message })
}

export function streamChatMessage(
  message: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
) {
  return apiClient.stream('/chat/message', { message }, onChunk, signal)
}
