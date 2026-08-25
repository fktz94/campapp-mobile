import { useQuery } from '@tanstack/react-query'

import { useVisualizador } from '@/hooks/visualizador/useVisualizador'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import { buildVisualizadorQuery } from '@/lib/services/visualizadorQueries'
import { Card, DatosVisualizador } from '@/lib/types/visualizador'
import Banner from './Banner'
import CultivoAntecesor from './CultivoAntecesor'
import InfoGrid from './InfoGrid'
import LaboresList from './LaboresList'

const ContenidoLote = () => {
  const { campania, establecimiento, lote } = useVisualizador()

  const { queryKey, queryFn } = buildVisualizadorQuery('lote', {
    campania: campania ?? '',
    establecimiento: establecimiento ?? '',
    lote: lote ?? '',
    cultivo: '',
  })

  const { data } = useQuery<DatosVisualizador>({ queryKey, queryFn, enabled: false })

  if (!data) return null

  const infoCards: Card[] = [
    {
      value: fmt(data.superficie),
      label: 'Superficie (ha)',
    },
    {
      value: data.cultivo || '—',
      label: 'Cultivo',
      infoValueSmall: true,
    },
    {
      value: data.cantidadLabores,
      label: 'Labores',
    },
  ]

  return (
    <>
      <InfoGrid cards={infoCards} />
      {data.cultivoAntecesor && (
        <CultivoAntecesor
          campañaAntecesor={data.campañaAntecesor}
          cultivoAntecesor={data.cultivoAntecesor}
        />
      )}
      {(data.fechaSiembra || data.fechaSiembraPlan) && (
        <Banner
          label="Fecha de siembra"
          value={data.fechaSiembra ?? `pendiente (${data.fechaSiembraPlan})`}
        />
      )}
      {/* {data.rendimientoKgHa && (
        <Banner
          value={`${data.rendimientoKgHa?.toString()} kg/ha`}
          label="Rendimiento de cosecha"
        />
      )} */}
      <LaboresList bloques={data.bloques} />
    </>
  )
}

export default ContenidoLote
