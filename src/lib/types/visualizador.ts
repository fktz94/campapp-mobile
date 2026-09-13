import { VIEWS } from '@/constants/views'

export type VisualizadorView = (typeof VIEWS)[number]['value']

export type VisualizadorURLParams = {
  campania?: string
  cultivo?: string
  establecimiento?: string
  lote?: string
  view?: string
}

export type VisualizadorState = {
  view: VisualizadorView
  campania: string | undefined
  establecimiento: string | undefined
  lote: string | undefined
  cultivo: string | undefined
}

export type FilterOptions = {
  campanias: string[]
  cultivos: string[]
  establecimientos: string[]
  lotesByEstablecimiento: Record<string, string[]>
}

export type VisualizadorParamKey = keyof Omit<VisualizadorState, 'view'>

type Producto = { producto: string; dosis: string | number; unidad?: string }

export type Bloque = {
  fecha: string
  fechaReal: string | null
  labor: string
  estado?: string
  productos?: Producto[]
  tieneServicio?: boolean
  provServicio?: string
  proveedores?: string[]
  observaciones?: string
}

export type DatosVisualizador = {
  ok: boolean
  superficie: string
  cultivo: string
  cultivoAntecesor: string
  campañaAntecesor: string
  bloques: Bloque[]
  cantidadLabores: number
  cosechaKg: number
  rendimientoKgHa: number | null
  fechaSiembra: string | null
  fechaSiembraPlan: string | null
}

export interface Card {
  label: string
  value: string | number
  infoValueSmall?: boolean
}

export interface InfoGridProps {
  cards: Card[]
}

export type CultivoResumenItem = {
  cultivo: string
  lotes: number
  hectareas: number
}

export type DatosResumen = {
  ok: boolean
  lotes: LoteResumen[]
  totalHa: number
  cultivoResumen: CultivoResumenItem[]
}

export type DatosPorCultivo = {
  ok: boolean
  lotes: LotePorCultivo[]
  totalHa: number
  establecimientos: number
}

type LoteBase = {
  lote: string
  cultivo: string
  superficie: string
  cantidadAplicaciones: number
  ultimasLabores: { fecha: string; labor: string; fechaReal: string }[]
  fechaSiembra: string | null
  fechaSiembraPlan: string | null
  rendimientoKgHa: number | null
  cultivoAntecesor: string
  campañaAntecesor: string
}

export type LoteResumen = LoteBase
export type LotePorCultivo = LoteBase & { establecimiento: string }
