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

type Producto = {
  producto: string
  categoria: string
  dosis: string | number
  unidad: string
  superficie: string
}

export type Bloque = {
  fecha: string
  fechaReal: string
  labor: string
  estado: string
  responsable: string
  productos: Producto[]
  tieneServicio: boolean
  provServicio: string
  proveedores: string[]
  observaciones: string
}

export interface Card {
  label: string
  value: string | number
  infoValueSmall?: boolean
}
