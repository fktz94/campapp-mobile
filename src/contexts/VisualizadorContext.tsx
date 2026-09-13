import { createContext, ReactNode, useContext } from 'react'

import { useVisualizador } from '@/hooks/visualizador/useVisualizador'

type VisualizadorContextValue = ReturnType<typeof useVisualizador>

const VisualizadorContext = createContext<VisualizadorContextValue | null>(null)

export function VisualizadorProvider({ children }: { children: ReactNode }) {
  const value = useVisualizador()
  return <VisualizadorContext.Provider value={value}>{children}</VisualizadorContext.Provider>
}

export function useVisualizadorContext() {
  const ctx = useContext(VisualizadorContext)
  if (!ctx) {
    throw new Error('useVisualizadorContext should be used inside VisualizadorProvider')
  }
  return ctx
}
