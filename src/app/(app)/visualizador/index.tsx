import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Screen } from '@/components/ui/Screen'
import ContentLoader from '@/components/visualizador/ContentLoader'
import VisualizadorContent from '@/components/visualizador/VisualizadorContent'
import { VisualizadorFilters } from '@/components/visualizador/VisualizadorFilters'
import { VIEWS } from '@/constants/views'
import { useVisualizador } from '@/hooks/visualizador/useVisualizador'
import { buildVisualizadorQuery } from '@/lib/services/visualizadorQueries'
import { useState } from 'react'

export default function VisualizadorScreen() {
  const queryClient = useQueryClient()
  const {
    view,
    setView,
    isComplete,
    campania,
    establecimiento,
    lote,
    cultivo,
    campanias,
    setCampania,
  } = useVisualizador()
  const [isLoading, setIsLoading] = useState(false)
  const search = () => {
    if (!isComplete) return
    const { queryKey, queryFn } = buildVisualizadorQuery(view, {
      campania: campania ?? '',
      establecimiento: establecimiento ?? '',
      lote: lote ?? '',
      cultivo: cultivo ?? '',
    })
    const fn = () => {
      setIsLoading(true)
      return queryFn()
    }
    queryClient
      .fetchQuery({ queryKey, queryFn: fn, staleTime: 1000 * 60 * 60 })
      .finally(() => setIsLoading(false))
  }

  return (
    <Screen>
      <ChipSelect options={VIEWS} value={view} onChange={setView} />
      <VisualizadorFilters />
      {isLoading ? <ContentLoader /> : <VisualizadorContent />}
      <Button label="Buscar" onPress={search} disabled={!isComplete} />
    </Screen>
  )
}
