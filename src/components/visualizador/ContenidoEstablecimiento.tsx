import { useQuery } from '@tanstack/react-query'
import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'
import { useVisualizador } from '@/hooks/visualizador/useVisualizador'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import { buildVisualizadorQuery } from '@/lib/services/visualizadorQueries'
import { Card, DatosResumen } from '@/lib/types/visualizador'
import InfoGrid from './InfoGrid'

const ContenidoEstablecimiento = () => {
  const { campania, establecimiento } = useVisualizador()

  const { queryKey, queryFn } = buildVisualizadorQuery('establecimiento', {
    campania: campania ?? '',
    establecimiento: establecimiento ?? '',
    lote: '',
    cultivo: '',
  })

  const { data } = useQuery<DatosResumen>({ queryKey, queryFn, enabled: false })

  if (!data || !data.lotes.length) return null

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
        <View key={l.lote} style={s.loteCard}>
          <View style={s.loteHdr}>
            <Text style={s.loteNombre}>Lote {l.lote}</Text>
            <Text style={s.loteMeta}>
              {l.cultivo || '—'} · <Text style={s.loteHa}>{l.superficie} ha</Text>
            </Text>
          </View>

          <Text style={s.dato}>
            {l.cantidadAplicaciones} aplicacion{l.cantidadAplicaciones !== 1 ? 'es' : ''}
          </Text>

          {l.fechaSiembra ? (
            <Text style={s.dato}>
              Sembrado: <Text style={s.datoStrong}>{l.fechaSiembra}</Text>
            </Text>
          ) : l.fechaSiembraPlan ? (
            <Text style={s.dato}>
              Siembra planificada:{' '}
              <Text style={[s.datoStrong, s.pendiente]}>{l.fechaSiembraPlan}</Text>
            </Text>
          ) : null}

          {l.rendimientoKgHa != null && (
            <Text style={s.dato}>
              Rinde:{' '}
              <Text style={s.datoStrong}>{l.rendimientoKgHa.toLocaleString('es-AR')} kg/ha</Text>
            </Text>
          )}

          {l.cultivoAntecesor && (
            <Text style={s.dato}>
              Antecesor <Text style={s.datoStrong}>{l.campañaAntecesor}</Text>: {l.cultivoAntecesor}
            </Text>
          )}

          {l.ultimasLabores.length > 0 && (
            <>
              <Text style={s.ultLabel}>Últimas labores</Text>
              {l.ultimasLabores.map((u, i) => (
                <Text key={i} style={s.ultLinea}>
                  · {u.fechaReal ? u.fechaReal : <Text style={s.pendiente}>pendiente</Text>} ·{' '}
                  {u.labor}
                  {!u.fechaReal && <Text style={s.planDim}> (plan. {u.fecha})</Text>}
                </Text>
              ))}
            </>
          )}
        </View>
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
    borderBottomColor: '#f0f0f0',
  },
  cultivoNombre: { fontWeight: '700' },
  cultivoMeta: { fontSize: font.sm },
  cultivoHa: { color: colors.primary, fontWeight: '700' },
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
    marginBottom: spacing.xs,
  },
  loteNombre: { fontWeight: '700', color: colors.primary, fontSize: font.md },
  loteMeta: { fontSize: font.sm, color: colors.textSecondary },
  loteHa: { fontWeight: '700' },
  dato: { fontSize: font.sm, color: '#444', marginBottom: 2 },
  datoStrong: { fontWeight: '700' },
  pendiente: { color: '#c07a00', fontWeight: '600' },
  ultLabel: {
    fontSize: font.sm - 3,
    fontWeight: '700',
    color: '#bbb',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 6,
    marginBottom: 2,
  },
  ultLinea: { fontSize: font.sm - 1, color: '#777', paddingLeft: spacing.xs, marginBottom: 1 },
  planDim: { color: '#ccc' },
})
