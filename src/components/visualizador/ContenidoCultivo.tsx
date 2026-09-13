import { StyleSheet, Text } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'
import { useVisualizadorContext } from '@/contexts/VisualizadorContext'
import { useDatosPorCultivo } from '@/hooks/sheets/useDatosPorCultivo'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import type { Card } from '@/lib/types/visualizador'
import ContenidoGuard from './ContenidoGuard'
import InfoGrid from './InfoGrid'
import LoteCard from './LoteCard'

const ContenidoCultivo = () => {
  const { campania, cultivo } = useVisualizadorContext()
  const { data, isLoading } = useDatosPorCultivo(campania ?? '', cultivo ?? '')

  if (isLoading || !data?.lotes.length)
    return <ContenidoGuard isLoading={isLoading} hasData={!!data?.lotes.length} view="cultivo" />

  const infoCards: Card[] = [
    { value: fmt(data.totalHa), label: 'Hectáreas' },
    { value: data.lotes.length, label: 'Lotes' },
    { value: data.establecimientos, label: 'Establecimientos' },
  ]

  return (
    <>
      <InfoGrid cards={infoCards} />
      <Text style={s.sectionLabel}>Detalle por lote</Text>
      {data.lotes.map((l) => (
        <LoteCard
          key={`${l.establecimiento}-${l.lote}`}
          title={`${l.establecimiento} · ${l.lote}`}
          superficie={l.superficie}
          cantidadAplicaciones={l.cantidadAplicaciones}
          fechaSiembra={l.fechaSiembra}
          fechaSiembraPlan={l.fechaSiembraPlan}
          rendimientoKgHa={l.rendimientoKgHa}
          cultivoAntecesor={l.cultivoAntecesor}
          campañaAntecesor={l.campañaAntecesor}
          ultimasLabores={l.ultimasLabores}
        />
      ))}
    </>
  )
}

export default ContenidoCultivo

const s = StyleSheet.create({
  sectionLabel: {
    fontSize: font.sm - 2,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
})
