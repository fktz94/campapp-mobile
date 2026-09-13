import { StyleSheet, Text, View } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'
import { useVisualizadorContext } from '@/contexts/VisualizadorContext'
import { useDatosResumen } from '@/hooks/sheets/useDatosResumen'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import type { Card } from '@/lib/types/visualizador'
import ContenidoGuard from './ContenidoGuard'
import InfoGrid from './InfoGrid'
import LoteCard from './LoteCard'

const ContenidoEstablecimiento = () => {
  const { campania, establecimiento } = useVisualizadorContext()
  const { data, isLoading } = useDatosResumen(campania ?? '', establecimiento ?? '')

  if (isLoading || !data?.lotes.length)
    return (
      <ContenidoGuard isLoading={isLoading} hasData={!!data?.lotes.length} view="establecimiento" />
    )

  const infoCards: Card[] = [
    { value: fmt(data.totalHa), label: 'Hectáreas totales' },
    { value: data.lotes.length, label: 'Lotes activos' },
    { value: data.cultivoResumen.length, label: 'Cultivos' },
  ]

  return (
    <>
      <InfoGrid cards={infoCards} />
      {data.cultivoResumen.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>Por cultivo</Text>
          {data.cultivoResumen.map((c) => (
            <View key={c.cultivo} style={s.cultivoRow}>
              <Text style={s.cultivoNombre}>{c.cultivo}</Text>
              <Text style={s.cultivoMeta}>
                {c.lotes} lote{c.lotes !== 1 ? 's' : ''} ·{' '}
                <Text style={s.cultivoHa}>{Math.round(c.hectareas)} ha</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={s.sectionLabel}>Detalle por lote</Text>
      {data.lotes.map((l) => (
        <LoteCard
          key={l.lote}
          title={`Lote ${l.lote}`}
          superficie={l.superficie}
          cultivo={l.cultivo}
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

export default ContenidoEstablecimiento

const s = StyleSheet.create({
  section: { marginBottom: spacing.md },
  sectionLabel: {
    fontSize: font.sm - 2,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  cultivoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfacePressed,
  },
  cultivoNombre: { fontWeight: '700' },
  cultivoMeta: { fontSize: font.sm },
  cultivoHa: { color: colors.primary, fontWeight: '700' },
})
