import { useLocalSearchParams, useRouter } from 'expo-router'
import { Platform } from 'react-native'

import { VIEW_REQUIRED_PARAMS, VIEWS } from '@/constants/views'
import type {
  VisualizadorState,
  VisualizadorURLParams,
  VisualizadorView,
} from '@/lib/types/visualizador'
import { useAppStore } from '@/store/app'
import useFiltersOptions from './useFiltersOptions'

const useOptionsDefaults = Platform.OS === 'ios'

export function useVisualizador() {
  const router = useRouter()
  const params = useLocalSearchParams<VisualizadorURLParams>()
  const { data: options, isLoading, error } = useFiltersOptions()
  const last = useAppStore((s) => s.lastVisualizador)
  const setLastVisualizador = useAppStore((s) => s.setLastVisualizador)

  const validViews = VIEWS.map((v) => v.value) as string[]
  const view =
    params.view && validViews.includes(params.view)
      ? (params.view as VisualizadorView)
      : (last.view ?? VIEWS[0].value)

  const setView = (newView: VisualizadorView) => {
    router.setParams({ view: newView })
    setLastVisualizador({ view: newView })
  }

  const setCampania = (value: string) => {
    router.setParams({ campania: value })
    setLastVisualizador({ campania: value })
  }

  const setEstablecimiento = (value: string) => {
    const lotes = options?.lotesByEstablecimiento[value] ?? []
    const defaultLote = useOptionsDefaults ? lotes[0] : undefined
    router.setParams({ establecimiento: value, lote: defaultLote })
    setLastVisualizador({ establecimiento: value, lote: defaultLote })
  }

  const setLote = (value: string) => {
    router.setParams({ lote: value })
    setLastVisualizador({ lote: value })
  }

  const setCultivo = (value: string) => {
    router.setParams({ cultivo: value })
    setLastVisualizador({ cultivo: value })
  }

  const defaultEstablecimiento = useOptionsDefaults ? options?.establecimientos?.[0] : undefined

  const state: VisualizadorState = {
    view,
    campania:
      params.campania ??
      last.campania ??
      (useOptionsDefaults ? options?.campanias?.[0] : undefined),
    establecimiento: params.establecimiento ?? last.establecimiento ?? defaultEstablecimiento,
    lote:
      params.lote ??
      last.lote ??
      (useOptionsDefaults && defaultEstablecimiento
        ? options?.lotesByEstablecimiento?.[defaultEstablecimiento]?.[0]
        : undefined),
    cultivo:
      params.cultivo ?? last.cultivo ?? (useOptionsDefaults ? options?.cultivos?.[0] : undefined),
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
