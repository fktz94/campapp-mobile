import { useMemo } from 'react'

import { computeDatosResumen } from '@/lib/helpers/computeHelpers'
import { useCatalogos } from './useCatalogos'
import { useOperativo } from './useOperativo'

export function useDatosResumen(campania: string, est: string) {
  const catalogos = useCatalogos()
  const operativo = useOperativo()

  const data = useMemo(() => {
    if (!catalogos.data || !operativo.data) return undefined
    if (!campania || !est) return undefined
    return computeDatosResumen(
      {
        rotaciones: catalogos.data.rotaciones,
        laboresRows: operativo.data.laboresRows,
        cosechaRows: operativo.data.cosechaRows,
      },
      campania,
      est
    )
  }, [catalogos.data, operativo.data, campania, est])

  return {
    data,
    isLoading: catalogos.isLoading || operativo.isLoading,
    isFetching: catalogos.isFetching || operativo.isFetching,
    error: catalogos.error ?? operativo.error ?? null,
  }
}
