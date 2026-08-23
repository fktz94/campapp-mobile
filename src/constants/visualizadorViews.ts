import { VisualizadorParamKey, VisualizadorView } from '@/lib/types/visualizador'

export const VIEW_REQUIRED_PARAMS: Record<VisualizadorView, VisualizadorParamKey[]> = {
  lote: ['campania', 'establecimiento', 'lote'],
  establecimiento: ['campania', 'establecimiento'],
  cultivo: ['campania', 'cultivo'],
  rendimiento: ['campania', 'establecimiento'],
}
