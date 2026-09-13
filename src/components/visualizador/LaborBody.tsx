import { StyleSheet, Text, View } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import type { Bloque } from '@/lib/types/visualizador'
import ExpandableCard from '../ui/ExpandableCard'

const LaborBody = ({ b }: { b: Bloque }) => {
  const hecha = !!b.fechaReal
  const revisado = b.estado === 'Revisado'
  const productos = (b.productos ?? []).filter((p) => p.producto && p.producto !== 'Servicio')
  const provText = (b.proveedores ?? []).filter(Boolean).join(' · ')

  return (
    <ExpandableCard
      header={
        <View style={{ flex: 1 }}>
          <Text style={s.laborFecha}>{hecha ? b.fechaReal : 'Pendiente'}</Text>
          <Text style={s.laborLabor}>{b.labor || '—'}</Text>
          {b.fecha ? (
            <Text style={s.laborPlan}>
              {hecha ? `Planificado ${b.fecha}` : `Planificado para el ${b.fecha}`}
            </Text>
          ) : null}
        </View>
        // {/* <View style={revisado ? s.badgeOk : s.badgePend}>
        //   <Text style={revisado ? s.badgeOkText : s.badgePendText}>
        //     {b.estado || 'Sin revisar'}
        //   </Text>
        // </View> */}
      }
    >
      {productos.length ? (
        productos.map((p, pi) => (
          <View key={pi} style={s.prodRow}>
            <Text style={s.prodNombre}>{p.producto}</Text>
            <View style={s.prodRight}>
              <Text style={s.prodDosis}>{fmt(p.dosis)}</Text>
              <Text style={s.prodUnidad}>{p.unidad || ''}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={s.sinInsumos}>Sin insumos registrados</Text>
      )}

      {b.tieneServicio ? (
        <View style={s.servicioTag}>
          <Text style={s.servicioText}>Servicio{b.provServicio ? ` · ${b.provServicio}` : ''}</Text>
        </View>
      ) : null}

      {provText || b.observaciones ? (
        <View style={s.metaRow}>
          {provText ? <Text style={s.metaText}>{provText}</Text> : null}
          {b.observaciones ? <Text style={s.metaText}>{b.observaciones}</Text> : null}
        </View>
      ) : null}
    </ExpandableCard>
  )
}

export default LaborBody

const s = StyleSheet.create({
  laborFecha: { fontSize: font.lg, fontWeight: '700', color: colors.textDark },
  laborLabor: {
    fontSize: font.sm,
    fontWeight: '500',
    color: colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  laborPlan: { fontSize: font.sm - 2, color: '#b3b3b3', marginTop: 2 },
  badgeOk: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeOkText: { color: colors.primaryPressed, fontSize: font.sm - 3, fontWeight: '600' },
  badgePend: {
    backgroundColor: '#fff3e0',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgePendText: { color: colors.warningPressed, fontSize: font.sm - 3, fontWeight: '600' },
  prodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f6f1',
  },
  prodNombre: { flex: 1, color: colors.text, fontWeight: '500', fontSize: font.md },
  prodRight: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  prodDosis: { fontWeight: '700', color: colors.primary, fontSize: font.md },
  prodUnidad: { fontSize: font.sm - 2, color: colors.textMuted },
  sinInsumos: { color: colors.textMuted, fontSize: font.sm, fontStyle: 'italic' },
  servicioTag: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: colors.highlightBg,
    borderWidth: 1,
    borderColor: colors.highlightBorder,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  servicioText: { fontSize: font.sm - 2, color: colors.highlightText },
  metaRow: { marginTop: spacing.xs, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metaText: { fontSize: font.sm - 2, color: '#999' },
})
