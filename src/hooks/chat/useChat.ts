import { showChatError } from '@/lib/helpers/chat'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { fetchChatMessages, streamChatMessage, type ChatMessage } from '@/lib/services/chatService'
import { useAppStore } from '@/store/app'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useChat() {
  const user = useAppStore((s) => s.user)
  const userEmail = user?.email ?? 'anonymous'

  const messages = useAppStore((s) => s.messages)
  const setMessages = useAppStore((s) => s.setMessages)
  const addMessage = useAppStore((s) => s.addMessage)
  const appendToMessage = useAppStore((s) => s.appendToMessage)
  const removeMessage = useAppStore((s) => s.removeMessage)

  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false)

  const USER_MESSAGES_QUERY_KEY = QUERY_KEYS.chatMessages(userEmail)

  const { data, isLoading } = useQuery({
    queryKey: USER_MESSAGES_QUERY_KEY,
    queryFn: () => fetchChatMessages(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages)
    }
  }, [data, setMessages])

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const id = `assistant_${Date.now()}`
      addMessage({ id, role: 'assistant', text: '' })
      try {
        await streamChatMessage(messageText, (chunk) => appendToMessage(id, chunk))
      } catch (error) {
        removeMessage(id)
        throw error
      }
    },
    onError: (error: unknown) => {
      console.error('Error al enviar mensaje:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido al enviar el mensaje'

      if (errorMessage.includes('SESSION_EXPIRED')) {
        showChatError('La sesión expiró. Volvé a iniciar sesión.')
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        showChatError('Sin conexión a la red. Verificá tu señal.')
      } else {
        showChatError('No se pudo completar la respuesta. Intentá de nuevo.')
      }
    },
  })
  const isSending = sendMessageMutation.isPending
  const loadMoreMessages = async () => {
    if (messages.length === 0 || isLoadingMoreMessages || isLoading || isSending) return
    const oldestMessage = messages[0]

    try {
      setIsLoadingMoreMessages(true)
      const res = await fetchChatMessages(oldestMessage.id)
      if (res.messages.length > 0) {
        setMessages([...res.messages, ...messages])
      }
    } catch (error) {
      console.error('Error al cargar mensajes anteriores:', error)
      showChatError('No se pudo cargar el historial anterior.')
    } finally {
      setIsLoadingMoreMessages(false)
    }
  }

  const sendUserMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: text,
    }
    addMessage(userMessage)

    await sendMessageMutation.mutateAsync(text)
  }

  return {
    messages,
    isLoading,
    loadMoreMessages,
    sendMessage: sendUserMessage,
    isSending: sendMessageMutation.isPending,
    isLoadingMoreMessages,
  }
}
