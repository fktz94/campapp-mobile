import { useMemo } from 'react'

import { computeDatosCosecha } from '@/lib/helpers/computeHelpers'
import { useCatalogos } from './useCatalogos'
import { useOperativo } from './useOperativo'

export function useDatosCosecha(campania: string, est: string) {
  const catalogos = useCatalogos()
  const operativo = useOperativo()

  const data = useMemo(() => {
    if (!catalogos.data || !operativo.data) return undefined
    if (!campania || !est) return undefined
    return computeDatosCosecha(
      {
        rotaciones: catalogos.data.rotaciones,
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
