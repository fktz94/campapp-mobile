import { create } from 'zustand'

interface AppState {
  campania: string | null
  establecimiento: string | null
  setCampania: (c: string) => void
  setEstablecimiento: (e: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  campania: null,
  establecimiento: null,
  setCampania: (campania) => set({ campania }),
  setEstablecimiento: (establecimiento) => set({ establecimiento }),
}))
