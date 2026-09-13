import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/lib/queryKeys'
import {
  fetchCatalogosRaw,
  parseCultivosRotacion,
  parseListas,
  parseRotaciones,
} from '@/lib/services/sheetsService'
import type { ListasData, Rotacion } from '@/lib/types/sheets'

export type Catalogos = {
  listas: ListasData
  rotaciones: Rotacion[]
  cultivosRotacion: string[]
}

export function useCatalogos() {
  return useQuery<Catalogos>({
    queryKey: [QUERY_KEYS.catalogos],
    queryFn: async () => {
      const raw = await fetchCatalogosRaw()
      return {
        listas: parseListas(raw.listas),
        rotaciones: parseRotaciones(raw.rotaciones),
        cultivosRotacion: parseCultivosRotacion(raw.cultivos),
      }
    },
    staleTime: 24 * 60 * 60_000,
  })
}
