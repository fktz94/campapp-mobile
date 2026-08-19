import { useQuery } from '@tanstack/react-query'

import { getDatosCosecha } from '@/lib/sheetsService'

export function useDatosCosecha(campania: string, establecimiento: string) {
  return useQuery({
    queryKey: ['visualizador', 'lote', campania, establecimiento],
    queryFn: () => getDatosCosecha(campania, establecimiento),
    enabled: !!campania && !!establecimiento,
    staleTime: 1000 * 60 * 5,
  })
}
