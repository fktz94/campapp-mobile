// hooks/useFiltersOptions.ts
import { useMemo } from 'react'

import { buildFiltersOptions } from '@/lib/helpers/visualizadorHelpers'
import { useCatalogos } from '../sheets/useCatalogos'

export default function useFiltersOptions() {
  const { data, isLoading, isFetching, error, refetch } = useCatalogos()

  const options = useMemo(() => {
    if (!data) return undefined
    return buildFiltersOptions(data.rotaciones, data.listas, data.cultivosRotacion)
  }, [data])

  return { data: options, isLoading, isFetching, error, refetch }
}
