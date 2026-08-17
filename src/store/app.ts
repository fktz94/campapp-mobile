import type { User } from '@react-native-firebase/auth'
import { create } from 'zustand'

interface AppState {
  authError: string | null
  campania: string | null
  establecimiento: string | null
  hydrated: boolean
  isAuthenticating: boolean
  user: User | null

  setAuthError: (e: string | null) => void
  setCampania: (c: string) => void
  setEstablecimiento: (e: string) => void
  setHydrated: (v: boolean) => void
  setIsAuthenticating: (v: boolean) => void
  setUser: (u: User | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  authError: null,
  campania: null,
  establecimiento: null,
  hydrated: false,
  isAuthenticating: false,
  user: null,

  setAuthError: (authError) => set({ authError }),
  setCampania: (campania) => set({ campania }),
  setEstablecimiento: (establecimiento) => set({ establecimiento }),
  setHydrated: (hydrated) => set({ hydrated }),
  setIsAuthenticating: (v) => set({ isAuthenticating: v }),
  setUser: (user) => set({ user }),
}))
