import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { UserProfile } from '@/lib/types/auth'
import { VisualizadorView } from '@/lib/types/visualizador'

interface AppState {
  backendToken: string | null
  campania: string | null
  establecimiento: string | null
  googleAccessToken: string | null
  hydrated: boolean
  isAuthenticating: boolean
  lastVisualizador: {
    view: VisualizadorView
    campania: string | undefined
    establecimiento: string | undefined
    lote: string | undefined
    cultivo: string | undefined
  }
  user: UserProfile | null
  setBackendToken: (t: string | null) => void
  setCampania: (c: string | null) => void
  setEstablecimiento: (e: string | null) => void
  setGoogleAccessToken: (t: string | null) => void
  setHydrated: (v: boolean) => void
  setIsAuthenticating: (v: boolean) => void
  setLastVisualizador: (p: Partial<AppState['lastVisualizador']>) => void
  setUser: (u: UserProfile | null) => void
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
      lastVisualizador: {
        view: 'lote',
        campania: undefined,
        establecimiento: undefined,
        lote: undefined,
        cultivo: undefined,
      },
      user: null,

      setBackendToken: (backendToken) => set({ backendToken }),
      setCampania: (campania) => set({ campania }),
      setEstablecimiento: (establecimiento) => set({ establecimiento }),
      setGoogleAccessToken: (googleAccessToken) => set({ googleAccessToken }),
      setHydrated: (hydrated) => set({ hydrated }),
      setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),
      setLastVisualizador: (p) =>
        set((s) => ({ lastVisualizador: { ...s.lastVisualizador, ...p } })),
      setUser: (user) => set({ user }),

      resetAuth: () => set({ backendToken: null, googleAccessToken: null, user: null }),
    }),
    {
      name: 'campapp-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist ONLY token and non-sensitive app settings across restarts
      partialize: (state) => ({
        backendToken: state.backendToken,
        campania: state.campania,
        establecimiento: state.establecimiento,
        lastVisualizador: state.lastVisualizador,
      }),
    }
  )
)
