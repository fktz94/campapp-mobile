import type { User } from '@react-native-firebase/auth'
import { create } from 'zustand'

import { VisualizadorView } from '@/lib/types/visualizador'

interface AppState {
  authError: string | null
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
  user: User | null

  setAuthError: (e: string | null) => void
  setCampania: (c: string) => void
  setEstablecimiento: (e: string) => void
  setGoogleAccessToken: (t: string | null) => void
  setHydrated: (v: boolean) => void
  setIsAuthenticating: (v: boolean) => void
  setLastVisualizador: (p: Partial<AppState['lastVisualizador']>) => void
  setUser: (u: User | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  authError: null,
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

  setAuthError: (authError) => set({ authError }),
  setCampania: (campania) => set({ campania }),
  setEstablecimiento: (establecimiento) => set({ establecimiento }),
  setGoogleAccessToken: (googleAccessToken) => set({ googleAccessToken }),
  setHydrated: (hydrated) => set({ hydrated }),
  setIsAuthenticating: (v) => set({ isAuthenticating: v }),
  setLastVisualizador: (p) => set((s) => ({ lastVisualizador: { ...s.lastVisualizador, ...p } })),
  setUser: (user) => set({ user }),
}))
