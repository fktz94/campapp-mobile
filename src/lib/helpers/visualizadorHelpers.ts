import { ListasData, Rotacion } from '../types/sheets'
import { FilterOptions, VisualizadorView } from '../types/visualizador'

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

export function buildFiltersOptions(rotaciones: Rotacion[], listas: ListasData): FilterOptions {
  const establecimientos = [...new Set(rotaciones.map((r) => r.establecimiento))].sort()

  const lotesByEstablecimiento: Record<string, string[]> = {}
  rotaciones.forEach((r) => {
    ;(lotesByEstablecimiento[r.establecimiento] ??= []).push(r.lote)
  })

  return {
    campanias: listas.campanias,
    cultivos: listas.cultivos,
    establecimientos,
    lotesByEstablecimiento,
  }
}
