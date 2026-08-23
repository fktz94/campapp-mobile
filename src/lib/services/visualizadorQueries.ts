import {
  getDatosCosecha,
  getDatosPorCultivo,
  getDatosResumen,
  getDatosVisualizador,
} from '@/lib/services/sheetsService'
import { VisualizadorView } from '@/lib/types/visualizador'

type Params = {
  campania: string
  establecimiento: string
  lote: string
  cultivo: string
}

type VisualizadorQuery = {
  queryKey: readonly unknown[]
  queryFn: () => Promise<any>
}

export function buildVisualizadorQuery(view: VisualizadorView, params: Params): VisualizadorQuery {
  switch (view) {
    case 'lote':
      return {
        queryKey: ['visualizador', 'lote', params.campania, params.establecimiento, params.lote],
        queryFn: () => getDatosVisualizador(params.campania, params.establecimiento, params.lote),
      }
    case 'establecimiento':
      return {
        queryKey: ['visualizador', 'establecimiento', params.campania, params.establecimiento],
        queryFn: () => getDatosResumen(params.campania, params.establecimiento),
      }
    case 'cultivo':
      return {
        queryKey: ['visualizador', 'cultivo', params.campania, params.cultivo],
        queryFn: () => getDatosPorCultivo(params.campania, params.cultivo),
      }
    case 'rendimiento':
      return {
        queryKey: ['visualizador', 'rendimiento', params.campania, params.establecimiento],
        queryFn: () => getDatosCosecha(params.campania, params.establecimiento),
      }
  }
}
