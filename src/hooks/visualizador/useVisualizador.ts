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

const APPLY_IOS_DEFAULTS = Platform.OS === 'ios'

type VisualizadorPatch = Partial<Record<keyof VisualizadorURLParams, string | null>>

export function useVisualizador() {
  const router = useRouter()
  const params = useLocalSearchParams<VisualizadorURLParams>()
  const { data: options, isLoading, error } = useFiltersOptions()
  const last = useAppStore((s) => s.lastVisualizador)
  const setLastVisualizador = useAppStore((s) => s.setLastVisualizador)

  const updateVisualizador = (patch: VisualizadorPatch) => {
    const routerPatch = Object.fromEntries(
      Object.entries(patch).map(([k, v]) => [k, v === null ? '' : v])
    )
    router.setParams(routerPatch)

    const storePatch = Object.fromEntries(
      Object.entries(patch).map(([k, v]) => [k, v === null ? undefined : v])
    )
    setLastVisualizador(storePatch)
  }

  const validViews = VIEWS.map((v) => v.value)
  const view =
    params.view && validViews.includes(params.view as VisualizadorView)
      ? (params.view as VisualizadorView)
      : (last.view ?? VIEWS[0].value)

  const setView = (newView: VisualizadorView) => updateVisualizador({ view: newView })
  const setCampania = (value: string) => updateVisualizador({ campania: value })
  const setLote = (value: string) => updateVisualizador({ lote: value })
  const setCultivo = (value: string) => updateVisualizador({ cultivo: value })

  const setEstablecimiento = (value: string) => {
    const lotes = options?.lotesByEstablecimiento[value] ?? []
    const defaultLote = APPLY_IOS_DEFAULTS ? lotes[0] : undefined
    updateVisualizador({ establecimiento: value, lote: defaultLote ?? null })
  }

  const defaultEstablecimiento = APPLY_IOS_DEFAULTS ? options?.establecimientos?.[0] : undefined

  const state: VisualizadorState = {
    view,
    campania:
      params.campania ??
      last.campania ??
      (APPLY_IOS_DEFAULTS ? options?.campanias?.[0] : undefined),
    establecimiento: params.establecimiento ?? last.establecimiento ?? defaultEstablecimiento,
    lote:
      params.lote ??
      last.lote ??
      (APPLY_IOS_DEFAULTS && defaultEstablecimiento
        ? options?.lotesByEstablecimiento?.[defaultEstablecimiento]?.[0]
        : undefined),
    cultivo:
      params.cultivo ?? last.cultivo ?? (APPLY_IOS_DEFAULTS ? options?.cultivos?.[0] : undefined),
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
