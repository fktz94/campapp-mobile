import { StyleSheet, View } from 'react-native'

import { useVisualizadorContext } from '@/contexts/VisualizadorContext'
import { useDatosVisualizador } from '@/hooks/sheets/useDatosVisualizador'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import type { Card } from '@/lib/types/visualizador'
import Banner from './Banner'
import ContenidoVacio from './ContenidoVacio'
import CultivoAntecesor from './CultivoAntecesor'
import InfoGrid from './InfoGrid'
import LaboresList from './LaboresList'

const ContenidoLote = () => {
  const { campania, establecimiento, lote } = useVisualizadorContext()
  const { data } = useDatosVisualizador(campania ?? '', establecimiento ?? '', lote ?? '')

  if (!data) return <ContenidoVacio type="lote" />

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
