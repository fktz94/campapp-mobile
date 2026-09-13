import { useMemo } from 'react'

import { computeDatosVisualizador } from '@/lib/helpers/computeHelpers'
import { useCatalogos } from './useCatalogos'
import { useOperativo } from './useOperativo'

export function useDatosVisualizador(campania: string, est: string, lote: string) {
  const catalogos = useCatalogos()
  const operativo = useOperativo()

  const data = useMemo(() => {
    if (!catalogos.data || !operativo.data) return undefined
    if (!campania || !est || !lote) return undefined
    return computeDatosVisualizador(
      {
        rotaciones: catalogos.data.rotaciones,
        laboresRows: operativo.data.laboresRows,
        cosechaRows: operativo.data.cosechaRows,
      },
      campania,
      est,
      lote
    )
  }, [catalogos.data, operativo.data, campania, est, lote])

  return {
    data,
    isLoading: catalogos.isLoading || operativo.isLoading,
    isFetching: catalogos.isFetching || operativo.isFetching,
    error: catalogos.error ?? operativo.error ?? null,
  }
}
