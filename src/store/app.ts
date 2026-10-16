import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ChatMessage } from '@/lib/services/chatService'
import { UserProfile } from '@/lib/types/auth'
import { VisualizadorView } from '@/lib/types/visualizador'

interface AppState {
  backendToken: string | null
  campania: string | null
  establecimiento: string | null
  googleAccessToken: string | null
  hydrated: boolean
  isAuthenticating: boolean
  isAuthReady: boolean
  lastVisualizador: {
    view: VisualizadorView
    campania: string | undefined
    establecimiento: string | undefined
    lote: string | undefined
    cultivo: string | undefined
  }
  messages: ChatMessage[]
  user: UserProfile | null
  addMessage: (message: ChatMessage) => void
  appendToMessage: (id: string, chunk: string) => void
  setBackendToken: (t: string | null) => void
  setCampania: (c: string | null) => void
  setEstablecimiento: (e: string | null) => void
  setGoogleAccessToken: (t: string | null) => void
  setHydrated: (v: boolean) => void
  setIsAuthenticating: (v: boolean) => void
  setIsAuthReady: (v: boolean) => void
  setLastVisualizador: (p: Partial<AppState['lastVisualizador']>) => void
  setMessages: (m: ChatMessage[]) => void
  setUser: (u: UserProfile | null) => void
  removeMessage: (id: string) => void
  resetAuth: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      backendToken: null,
      campania: null,
      establecimiento: null,
      googleAccessToken: null,
      hydrated: false,
      isAuthenticating: false,
      isAuthReady: false,
      lastVisualizador: {
        view: 'lote',
        campania: undefined,
        establecimiento: undefined,
        lote: undefined,
        cultivo: undefined,
      },
      messages: [],
      user: null,

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      appendToMessage: (id: string, chunk: string) =>
        set((state) => {
          const newMessages = state.messages.map((m) => {
            if (m.id === id) {
              return { ...m, text: m.text + chunk }
            }
            return m
          })
          return { messages: [...newMessages] }
        }),
      setBackendToken: (backendToken) => set({ backendToken }),
      setCampania: (campania) => set({ campania }),
      setEstablecimiento: (establecimiento) => set({ establecimiento }),
      setGoogleAccessToken: (googleAccessToken) => set({ googleAccessToken }),
      setHydrated: (hydrated) => set({ hydrated }),
      setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
      setIsAuthReady: (isAuthReady) => set({ isAuthReady }),
      setLastVisualizador: (p) =>
        set((s) => ({ lastVisualizador: { ...s.lastVisualizador, ...p } })),
      setUser: (user) => set({ user }),
      setMessages: (messages) => set({ messages }),
      removeMessage: (id: string) =>
        set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
      resetAuth: () => set({ backendToken: null, googleAccessToken: null, user: null }),
    }),
    {
      name: 'campapp-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
      partialize: (state) => ({
        backendToken: state.backendToken,
        campania: state.campania,
        establecimiento: state.establecimiento,
        lastVisualizador: state.lastVisualizador,
        messages: state.messages,
      }),
    }
  )
)
