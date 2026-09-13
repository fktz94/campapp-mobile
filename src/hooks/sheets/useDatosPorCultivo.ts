import { useMemo } from 'react'

import { computeDatosPorCultivo } from '@/lib/helpers/computeHelpers'
import { useCatalogos } from './useCatalogos'
import { useOperativo } from './useOperativo'

export function useDatosPorCultivo(campania: string, cultivo: string) {
  const catalogos = useCatalogos()
  const operativo = useOperativo()

  const data = useMemo(() => {
    if (!catalogos.data || !operativo.data) return undefined
    if (!campania || !cultivo) return undefined
    return computeDatosPorCultivo(
      {
        rotaciones: catalogos.data.rotaciones,
        laboresRows: operativo.data.laboresRows,
        cosechaRows: operativo.data.cosechaRows,
      },
      campania,
      cultivo
    )
  }, [catalogos.data, operativo.data, campania, cultivo])

  return {
    data,
    isLoading: catalogos.isLoading || operativo.isLoading,
    isFetching: catalogos.isFetching || operativo.isFetching,
    error: catalogos.error ?? operativo.error ?? null,
  }
}
