import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'
import ExpandableCard from '../ui/ExpandableCard'

type UltimaLabor = {
  fecha: string
  labor: string
  fechaReal: string
}

type LoteCardProps = {
  title: string
  superficie: string | number
  cultivo?: string
  cantidadAplicaciones: number
  fechaSiembra?: string | null
  fechaSiembraPlan?: string | null
  rendimientoKgHa?: number | null
  cultivoAntecesor?: string
  campañaAntecesor?: string
  ultimasLabores?: UltimaLabor[]
}

const LoteCard = ({
  title,
  superficie,
  cultivo,
  cantidadAplicaciones,
  fechaSiembra,
  fechaSiembraPlan,
  rendimientoKgHa,
  cultivoAntecesor,
  campañaAntecesor,
  ultimasLabores = [],
}: LoteCardProps) => {
  return (
    <ExpandableCard
      showAccent={false}
      header={
        <View style={s.loteHdr}>
          <Text style={s.loteNombre}>{title}</Text>
          <Text style={s.loteMeta}>
            {cultivo ? `${cultivo} · ` : ''}
            <Text style={s.loteHa}>{superficie} ha</Text>
          </Text>
        </View>
      }
    >
      <Text style={s.dato}>
        {cantidadAplicaciones} aplicacion{cantidadAplicaciones !== 1 ? 'es' : ''}
      </Text>

      {fechaSiembra ? (
        <Text style={s.dato}>
          Sembrado: <Text style={s.datoStrong}>{fechaSiembra}</Text>
        </Text>
      ) : fechaSiembraPlan ? (
        <Text style={s.dato}>
          Siembra planificada: <Text style={[s.datoStrong, s.pendiente]}>{fechaSiembraPlan}</Text>
        </Text>
      ) : null}

      {rendimientoKgHa != null && (
        <Text style={s.dato}>
          Rinde: <Text style={s.datoStrong}>{rendimientoKgHa.toLocaleString('es-AR')} kg/ha</Text>
        </Text>
      )}

      {cultivoAntecesor ? (
        <Text style={s.dato}>
          Antecesor <Text style={s.datoStrong}>{campañaAntecesor}</Text>: {cultivoAntecesor}
        </Text>
      ) : null}

      {ultimasLabores.length > 0 && (
        <>
          <Text style={s.ultLabel}>Últimas labores</Text>
          {ultimasLabores.map((u, i) => (
            <Text key={i} style={s.ultLinea}>
              · {u.fechaReal ? u.fechaReal : <Text style={s.pendiente}>pendiente</Text>} · {u.labor}
              {!u.fechaReal && <Text style={s.planDim}> (plan. {u.fecha})</Text>}
            </Text>
          ))}
        </>
      )}
    </ExpandableCard>
  )
}

export default LoteCard

const s = StyleSheet.create({
  loteCard: {
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceAccent,
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
