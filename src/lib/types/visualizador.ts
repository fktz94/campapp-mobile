import { VIEWS } from '@/constants/views'

export type VisualizadorView = (typeof VIEWS)[number]['value']

export type VisualizadorContentProps =
  | { view: 'lote'; campania: string; establecimiento: string; lote: string }
  | { view: 'establecimiento'; campania: string; establecimiento: string }
  | { view: 'cultivo'; campania: string; cultivo: string }
  | { view: 'rendimiento'; campania: string; establecimiento: string }

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
