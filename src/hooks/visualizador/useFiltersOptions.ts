import { useQuery } from '@tanstack/react-query'

import { buildFiltersOptions } from '@/lib/helpers/visualizadorHelpers'
import { fetchListas, fetchRotaciones } from '@/lib/services/sheetsService'

function useFiltersOptions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const [rotaciones, listas] = await Promise.all([fetchRotaciones(), fetchListas()])
      return buildFiltersOptions(rotaciones, listas)
    },
  })

  return { data, isLoading, error }
}

export default useFiltersOptions
