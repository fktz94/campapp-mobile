import { useQuery } from '@tanstack/react-query'

import { getDatosResumen } from '@/lib/sheetsService'

export function useDatosResumen(campania: string, establecimiento: string) {
  return useQuery({
    queryKey: ['visualizador', 'lote', campania, establecimiento],
    queryFn: () => getDatosResumen(campania, establecimiento),
    enabled: !!campania && !!establecimiento,
    staleTime: 1000 * 60 * 5,
  })
}
