import type { User } from '@react-native-firebase/auth'
import { create } from 'zustand'

interface AppState {
  user: User | null
  hydrated: boolean
  authError: string | null
  campania: string | null
  establecimiento: string | null
  setUser: (u: User | null) => void
  setHydrated: (v: boolean) => void
  setAuthError: (e: string | null) => void
  setCampania: (c: string) => void
  setEstablecimiento: (e: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  hydrated: false,
  authError: null,
  campania: null,
  establecimiento: null,
  setUser: (user) => set({ user }),
  setHydrated: (hydrated) => set({ hydrated }),
  setAuthError: (authError) => set({ authError }),
  setCampania: (campania) => set({ campania }),
  setEstablecimiento: (establecimiento) => set({ establecimiento }),
}))
