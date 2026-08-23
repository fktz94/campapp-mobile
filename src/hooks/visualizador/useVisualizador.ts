import { useLocalSearchParams, useRouter } from 'expo-router'

import { VIEWS } from '@/constants/views'
import { VIEW_REQUIRED_PARAMS } from '@/constants/visualizadorViews'
import {
  VisualizadorState,
  VisualizadorURLParams,
  VisualizadorView,
} from '@/lib/types/visualizador'
import useFiltersOptions from './useFiltersOptions'

export function useVisualizador() {
  const router = useRouter()
  const params = useLocalSearchParams<VisualizadorURLParams>()
  const { data: options, isLoading, error } = useFiltersOptions()

  const validViews = VIEWS.map((v) => v.value) as string[]
  const view =
    params.view && validViews.includes(params.view)
      ? (params.view as VisualizadorView)
      : VIEWS[0].value

  const setView = (newView: VisualizadorView) => router.setParams({ view: newView })
  const setCampania = (value: string) => router.setParams({ campania: value })

  const setEstablecimiento = (value: string) => {
    const lotes = options?.lotesByEstablecimiento[value] ?? []
    router.setParams({ establecimiento: value, lote: lotes[0] })
  }

  const setLote = (value: string) => router.setParams({ lote: value })
  const setCultivo = (value: string) => router.setParams({ cultivo: value })

  const state: VisualizadorState = {
    view,
    campania: params.campania ?? options?.campanias?.[options.campanias.length - 1],
    establecimiento: params.establecimiento ?? options?.establecimientos?.[0],
    lote: params.lote ?? options?.lotesByEstablecimiento?.[options?.establecimientos?.[0]][0],
    cultivo: params.cultivo ?? options?.cultivos?.[options.cultivos.length - 1],
  }

  const requiredKeys = VIEW_REQUIRED_PARAMS[view]
  const isComplete = requiredKeys.every((key) => Boolean(state[key]))

  return {
    ...state,
    setView,
    setCampania,
    setEstablecimiento,
    setLote,
    setCultivo,
    campanias: options?.campanias ?? [],
    cultivos: options?.cultivos ?? [],
    establecimientos: options?.establecimientos ?? [],
    lotes: state.establecimiento
      ? (options?.lotesByEstablecimiento[state.establecimiento] ?? [])
      : [],
    filtersLoading: isLoading,
    filtersError: error,
    isComplete,
  }
}
