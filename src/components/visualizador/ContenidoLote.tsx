import { useQuery } from '@tanstack/react-query'
import { StyleSheet, View } from 'react-native'

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

  const showSiembra = Boolean(data.fechaSiembra || data.fechaSiembraPlan)
  const showRendimiento = Boolean(data.rendimientoKgHa)

  return (
    <>
      <InfoGrid cards={infoCards} />
      {data.cultivoAntecesor && (
        <CultivoAntecesor
          campañaAntecesor={data.campañaAntecesor}
          cultivoAntecesor={data.cultivoAntecesor}
        />
      )}

      <View style={s.bannerContainer}>
        {showSiembra && (
          <Banner
            label="Fecha de siembra"
            value={data.fechaSiembra ?? `pendiente (${data.fechaSiembraPlan})`}
            containerStyle={s.bannerStyle}
          />
        )}
        {showRendimiento && (
          <Banner
            value={`${data.rendimientoKgHa} kg/ha`}
            label="Rendimiento de cosecha"
            containerStyle={s.bannerStyle}
          />
        )}
      </View>
      <LaboresList bloques={data.bloques} />
    </>
  )
}

export default ContenidoLote

const s = StyleSheet.create({
  bannerContainer: { display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'center' },
  bannerStyle: { flex: 1, maxWidth: '50%' },
})
