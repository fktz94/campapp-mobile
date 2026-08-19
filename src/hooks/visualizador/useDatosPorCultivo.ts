import { useQuery } from '@tanstack/react-query'

import { getDatosPorCultivo } from '@/lib/sheetsService'

export function useDatosPorCultivo(campania: string, cultivo: string) {
  return useQuery({
    queryKey: ['visualizador', 'lote', campania, cultivo],
    queryFn: () => getDatosPorCultivo(campania, cultivo),
    enabled: !!campania && !!cultivo,
    staleTime: 1000 * 60 * 5,
  })
}
