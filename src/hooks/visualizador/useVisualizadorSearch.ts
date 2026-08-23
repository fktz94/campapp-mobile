import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { buildVisualizadorQuery } from '@/lib/services/visualizadorQueries'
import { VisualizadorView } from '@/lib/types/visualizador'
import { useVisualizador } from './useVisualizador'

export function useVisualizadorSearch() {
  const queryClient = useQueryClient()
  const { view, isComplete, campania, establecimiento, lote, cultivo } = useVisualizador()

  const [submittedView, setSubmittedView] = useState<VisualizadorView | null>(null)
  const [data, setData] = useState<any>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const search = async () => {
    if (!isComplete) return

    const { queryKey, queryFn } = buildVisualizadorQuery(view, {
      campania: campania ?? '',
      establecimiento: establecimiento ?? '',
      lote: lote ?? '',
      cultivo: cultivo ?? '',
    })

    setSubmittedView(view)
    setIsFetching(true)
    setError(null)

    try {
      const result = await queryClient.fetchQuery({
        queryKey,
        queryFn,
        staleTime: 1000 * 60 * 5,
      })
      setData(result)
    } catch (e) {
      setError(e)
    } finally {
      setIsFetching(false)
    }
  }

  return { search, submittedView, data, isFetching, error }
}
