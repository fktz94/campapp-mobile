import { useQuery } from '@tanstack/react-query'

import { fetchOperativoRaw } from '@/lib/services/sheetsService'

export type Operativo = {
  laboresRows: string[][]
  cosechaRows: string[][]
}

export function useOperativo() {
  return useQuery<Operativo>({
    queryKey: ['operativo'],
    queryFn: async () => {
      const raw = await fetchOperativoRaw()
      return {
        laboresRows: raw.labores,
        cosechaRows: raw.cosecha,
      }
    },
    staleTime: 12 * 60 * 60_000, // 12h — operativo cambia más seguido
  })
}
