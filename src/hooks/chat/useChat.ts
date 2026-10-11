// lib/hooks/useChat.ts
import { QUERY_KEYS } from '@/lib/queryKeys'
import { fetchChatMessages, sendChatMessage } from '@/lib/services/chatService'
import { useAppStore } from '@/store/app'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useChat() {
  const queryClient = useQueryClient()
  const user = useAppStore((s) => s.user)
  const userEmail = user?.email ?? 'anonymous'

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.chatMessages(userEmail),
    queryFn: async () => {
      return await fetchChatMessages()
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => sendChatMessage(message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatMessages(userEmail) })
    },
  })

  return {
    messages: data ?? [],
    isLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  }
}
