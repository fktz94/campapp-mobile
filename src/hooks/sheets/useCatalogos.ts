import { useQuery } from '@tanstack/react-query'

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
    queryKey: ['catalogos'],
    queryFn: async () => {
      const raw = await fetchCatalogosRaw()
      return {
        listas: parseListas(raw.listas),
        rotaciones: parseRotaciones(raw.rotaciones),
        cultivosRotacion: parseCultivosRotacion(raw.cultivos),
      }
    },
    staleTime: 24 * 60 * 60_000, // 24h — catálogos cambian muy poco
  })
}
