import type { VisualizadorParamKey, VisualizadorView } from '@/lib/types/visualizador'

export const VIEW_REQUIRED_PARAMS: Record<VisualizadorView, VisualizadorParamKey[]> = {
  lote: ['campania', 'establecimiento', 'lote'],
  establecimiento: ['campania', 'establecimiento'],
  cultivo: ['campania', 'cultivo'],
  rendimiento: ['campania', 'establecimiento'],
}

export const VIEWS = [
  { label: 'Lotes', value: 'lote' },
  { label: 'Establecimientos', value: 'establecimiento' },
  { label: 'Cultivos', value: 'cultivo' },
  { label: 'Rendimiento', value: 'rendimiento' },
] as const
