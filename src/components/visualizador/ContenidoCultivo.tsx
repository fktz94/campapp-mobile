import { useQuery } from '@tanstack/react-query'
import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'
import { useVisualizador } from '@/hooks/visualizador/useVisualizador'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import { buildVisualizadorQuery } from '@/lib/services/visualizadorQueries'
import { Card, DatosPorCultivo } from '@/lib/types/visualizador'
import InfoGrid from './InfoGrid'

const ContenidoCultivo = () => {
  const { campania, cultivo } = useVisualizador()

  const { queryKey, queryFn } = buildVisualizadorQuery('cultivo', {
    campania: campania ?? '',
    establecimiento: '',
    lote: '',
    cultivo: cultivo ?? '',
  })

  const { data } = useQuery<DatosPorCultivo>({ queryKey, queryFn, enabled: false })

  if (!data || !data.lotes.length) return null

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
        <View key={`${l.establecimiento}-${l.lote}`} style={s.loteCard}>
          <View style={s.loteHdr}>
            <Text style={s.loteNombre}>
              {l.establecimiento} · {l.lote}
            </Text>
            <Text style={s.loteMeta}>
              <Text style={s.loteHa}>{l.superficie} ha</Text>
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
