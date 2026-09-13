import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'
import { useDatosCosecha } from '@/hooks/sheets/useDatosCosecha'
import { useVisualizador } from '@/hooks/visualizador/useVisualizador'
import type { Card } from '@/lib/types/visualizador'
import ContenidoVacio from './ContenidoVacio'
import InfoGrid from './InfoGrid'

const ContenidoRendimiento = () => {
  const { campania, establecimiento } = useVisualizador()
  const { data, isLoading } = useDatosCosecha(campania ?? '', establecimiento ?? '')

  if (isLoading) return null
  if (!data || !data.lotes.length) return <ContenidoVacio type="rendimiento" />

  const infoCards: Card[] = [
    { value: data.lotes.length, label: 'Lotes cosechados' },
    { value: Math.round(data.totales.totalHa), label: 'Hectáreas' },
    {
      value: data.totales.kgHaTotal ? `${data.totales.kgHaTotal.toLocaleString('es-AR')}` : '—',
      label: 'Rinde prom. kg/ha',
      infoValueSmall: true,
    },
  ]

  return (
    <>
      <InfoGrid cards={infoCards} />

      <Text style={s.sectionLabel}>Detalle por lote</Text>
      {data.lotes.map((l) => (
        <View key={l.lote} style={s.loteCard}>
          <View style={s.loteHdr}>
            <Text style={s.loteNombre}>Lote {l.lote}</Text>
            <Text style={s.loteMeta}>
              {l.cultivo || '—'} · <Text style={s.loteHa}>{l.superficie} ha</Text>
            </Text>
          </View>

          <View style={s.row}>
            <View style={s.stat}>
              <Text style={s.statValue}>{l.kgTotal.toLocaleString('es-AR')}</Text>
              <Text style={s.statLabel}>kg tolva</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statValue}>{l.kgHa ? l.kgHa.toLocaleString('es-AR') : '—'}</Text>
              <Text style={s.statLabel}>kg/ha</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statValue}>{l.camiones}</Text>
              <Text style={s.statLabel}>camiones</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={s.totalCard}>
        <Text style={s.totalLabel}>Total cosechado</Text>
        <Text style={s.totalValue}>{data.totales.kgTotal.toLocaleString('es-AR')} kg</Text>
        {data.totales.kgHaTotal && (
          <Text style={s.totalSub}>
            {data.totales.kgHaTotal.toLocaleString('es-AR')} kg/ha promedio
          </Text>
        )}
      </View>
    </>
  )
}

export default ContenidoRendimiento

const s = StyleSheet.create({
  sectionLabel: {
    fontSize: font.sm - 2,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  loteCard: {
    borderWidth: 1,
    borderColor: '#e0ece0',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#fafff8',
  },
  loteHdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  loteNombre: { fontWeight: '700', color: colors.primary, fontSize: font.md },
  loteMeta: { fontSize: font.sm, color: colors.textSecondary },
  loteHa: { fontWeight: '700' },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
  },
  statValue: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: font.sm - 2,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  totalCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: font.sm - 2,
    color: '#a5d6a7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.surface,
  },
  totalSub: {
    fontSize: font.sm,
    color: '#c8e6c9',
    marginTop: 4,
  },
})
