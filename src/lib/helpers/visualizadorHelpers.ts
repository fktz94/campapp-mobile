import { VisualizadorView } from '@/constants/views'

export const getMissingParamsMessage = (view: VisualizadorView, params: Record<string, any>) => {
  const required: Record<VisualizadorView, string[]> = {
    lote: ['campania', 'establecimiento', 'lote'],
    establecimiento: ['campania', 'establecimiento'],
    cultivo: ['campania', 'cultivo'],
    rendimiento: ['campania', 'establecimiento'],
  }
  const missing = required[view].filter((key) => !params[key])
  if (missing.length === 0) return null
  return `Faltan parámetros: ${missing.join(', ')}`
}
