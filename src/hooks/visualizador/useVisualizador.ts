import { VIEWS } from '@/constants/views'
import {
  VisualizadorState,
  VisualizadorURLParams,
  VisualizadorView,
} from '@/lib/types/visualizador'
import { useLocalSearchParams, useRouter } from 'expo-router'

export function useVisualizador() {
  const router = useRouter()
  const params = useLocalSearchParams<VisualizadorURLParams>()

  const validViews = VIEWS.map((v) => v.value) as string[]
  const view =
    params.view && validViews.includes(params.view)
      ? (params.view as VisualizadorView)
      : VIEWS[0].value

  const setView = (newView: VisualizadorView) => router.setParams({ view: newView })
  const setCampania = (value: string) => router.setParams({ campania: value })
  const setEstablecimiento = (value: string) =>
    router.setParams({ establecimiento: value, lote: undefined })
  const setLote = (value: string) => router.setParams({ lote: value })
  const setCultivo = (value: string) => router.setParams({ cultivo: value }) // ✅ corregido

  const state: VisualizadorState = {
    view,
    campania: params.campania,
    establecimiento: params.establecimiento,
    lote: params.lote,
    cultivo: params.cultivo,
  }

  return {
    ...state,
    setView,
    setCampania,
    setEstablecimiento,
    setLote,
    setCultivo,
  }
}
