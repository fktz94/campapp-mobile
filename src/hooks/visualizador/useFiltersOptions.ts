import { useQuery } from '@tanstack/react-query'

import { buildFiltersOptions } from '@/lib/helpers/visualizadorHelpers'
import { fetchCultivosRotacion, fetchListas, fetchRotaciones } from '@/lib/services/sheetsService'

function useFiltersOptions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const [rotaciones, listas, cultivosRotacion] = await Promise.all([
        fetchRotaciones(),
        fetchListas(),
        fetchCultivosRotacion(),
      ])
      return buildFiltersOptions(rotaciones, listas, cultivosRotacion)
    },
  })

  return { data, isLoading, error }
}

export default useFiltersOptions
