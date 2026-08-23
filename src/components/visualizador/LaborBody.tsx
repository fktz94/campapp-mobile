import { colors, font, radius, spacing } from '@/constants/theme'
import { formatDateToDMY } from '@/lib/helpers/date'
import { fmt } from '@/lib/helpers/visualizadorHelpers'
import { Bloque } from '@/lib/types/visualizador'
import { useEffect, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native'

const LaborBody = ({ b }: { b: Bloque }) => {
  const [isOpened, setIsOpened] = useState(false)
  const hecha = !!b.fechaReal
  const revisado = b.estado === 'Revisado'
  const productos = (b.productos ?? []).filter((p) => p.producto && p.producto !== 'Servicio')
  const provText = (b.proveedores ?? []).filter(Boolean).join(' · ')

  const scaleAnim = useRef(new Animated.Value(1)).current
  const heightAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const [contentHeight, setContentHeight] = useState(0)

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }
  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }
  const toggleOpen = () => {
    setIsOpened(!isOpened)
  }

  useEffect(() => {
    if (contentHeight === 0) return

    if (isOpened) {
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: contentHeight,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [isOpened, contentHeight, heightAnim, opacityAnim])

  const handleMeasure = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height)
    }
  }

  const renderBodyContent = () => (
    <>
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
    </>
  )

  return (
    <Pressable
      onPress={toggleOpen}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => ({ opacity: pressed ? 0.98 : 1 })}
    >
      <Animated.View
        style={[
          s.laborCard,
          revisado ? s.laborCardRevisado : s.laborCardPendiente,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={s.hiddenMeasurer} onLayout={handleMeasure} pointerEvents="none">
          <View style={s.laborBodyContent}>{renderBodyContent()}</View>
        </View>
        <View style={s.laborHdr}>
          <View style={{ flex: 1 }}>
            <Text style={s.laborFecha}>
              {hecha ? (b.fechaReal ? formatDateToDMY(b.fechaReal) : '') : 'Pendiente'}
            </Text>
            <Text style={s.laborLabor}>{b.labor || '—'}</Text>
            {b.fecha ? (
              <Text style={s.laborPlan}>
                {hecha
                  ? `Planificado ${b.fecha ? formatDateToDMY(b.fecha) : ''}`
                  : `Planificado para el ${b.fecha ? formatDateToDMY(b.fecha) : ''}`}
              </Text>
            ) : null}
          </View>
          <View style={revisado ? s.badgeOk : s.badgePend}>
            <Text style={revisado ? s.badgeOkText : s.badgePendText}>
              {b.estado || 'Sin revisar'}
            </Text>
          </View>
        </View>
        <Animated.View
          style={[
            s.laborBodyWrapper,
            {
              height: heightAnim,
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={s.laborBodyContent}>{renderBodyContent()}</View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}

export default LaborBody

const s = StyleSheet.create({
  laborCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    marginBottom: spacing.sm,
    overflow: 'visible',
  },
  laborCardRevisado: { borderLeftColor: colors.primary },
  laborCardPendiente: { borderLeftColor: '#ff9800' },

  laborHdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#f5f9f4',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f0e6',
  },
  laborFecha: { fontSize: font.lg, fontWeight: '700', color: '#1a3a16' },
  laborLabor: {
    fontSize: font.sm,
    fontWeight: '500',
    color: '#7a9970',
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
  badgeOkText: { color: '#1b5e20', fontSize: font.sm - 3, fontWeight: '600' },
  badgePend: {
    backgroundColor: '#fff3e0',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgePendText: { color: '#e65100', fontSize: font.sm - 3, fontWeight: '600' },

  laborBodyWrapper: {
    overflow: 'hidden',
  },

  laborBodyContent: {
    padding: spacing.md,
  },

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
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffe082',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  servicioText: { fontSize: font.sm - 2, color: '#795548' },
  metaRow: { marginTop: spacing.xs, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metaText: { fontSize: font.sm - 2, color: '#999' },

  hiddenMeasurer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
})
