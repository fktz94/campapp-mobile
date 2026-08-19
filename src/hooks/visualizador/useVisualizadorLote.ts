import { useQuery } from '@tanstack/react-query'

import { getDatosVisualizador } from '@/lib/sheetsService'

export function useVisualizadorLote(campania: string, establecimiento: string, lote: string) {
  return useQuery({
    queryKey: ['visualizador', 'lote', campania, establecimiento, lote],
    queryFn: () => getDatosVisualizador(campania, establecimiento, lote),
    enabled: !!campania && !!establecimiento && !!lote,
    staleTime: 1000 * 60 * 5,
  })
}
