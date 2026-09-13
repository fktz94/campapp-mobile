import type { ListasData, Rotacion } from '../types/sheets'
import type { FilterOptions, VisualizadorView } from '../types/visualizador'

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

export function buildFiltersOptions(
  rotaciones: Rotacion[],
  listas: ListasData,
  cultivosRotacion: string[]
): FilterOptions {
  const establecimientos = [...new Set(rotaciones.map((r) => r.establecimiento))].sort()

  const lotesByEstablecimiento: Record<string, string[]> = {}
  rotaciones.forEach((r) => {
    ;(lotesByEstablecimiento[r.establecimiento] ??= []).push(r.lote)
  })

  return {
    campanias: [...listas.campanias].sort((a, b) => {
      const aYear = parseInt(a.split('/')[1] ?? '0')
      const bYear = parseInt(b.split('/')[1] ?? '0')
      return bYear - aYear
    }),
    cultivos: cultivosRotacion.length ? cultivosRotacion : listas.cultivos,
    establecimientos,
    lotesByEstablecimiento,
  }
}

export function fmt(n: number | string | undefined | null) {
  if (n === null || n === undefined || n === '') return '—'
  const x = parseFloat(String(n))
  if (isNaN(x)) return '—'
  if (x === 0) return '0'
  if (x === Math.floor(x)) return x.toString()
  return x >= 1 ? x.toFixed(1) : x.toFixed(2)
}
