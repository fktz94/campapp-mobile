import { useQuery } from '@tanstack/react-query'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { DateField } from '@/components/ui/DateField'
import { FieldInput } from '@/components/ui/FieldInput'
import { Label } from '@/components/ui/Label'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { colors, spacing } from '@/constants/theme'
import { useOrdenForm } from '@/hooks/useOrdenForm'
import { getDatosIniciales } from '@/lib/sheetsService'

export default function NuevaLaborScreen() {
  const { data } = useQuery({
    queryKey: ['datosIniciales'],
    queryFn: getDatosIniciales,
    staleTime: 600_000,
  })
  const f = useOrdenForm(data)

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <SectionTitle>Encabezado</SectionTitle>
      <DateField label="Fecha" value={f.fecha} onChange={f.setFecha} />
      <Label>Labor *</Label>
      <ChipSelect options={data?.labores ?? []} value={f.labor} onChange={f.setLabor} />
      <Label>Responsable *</Label>
      <ChipSelect
        options={data?.responsables ?? []}
        value={f.responsable}
        onChange={f.setResponsable}
      />
      <Label>Proveedor</Label>
      <ChipSelect options={data?.proveedores ?? []} value={f.proveedor} onChange={f.setProveedor} />
      <FieldInput
        label="Observaciones"
        value={f.observaciones}
        onChangeText={f.setObservaciones}
        placeholder="Opcional"
      />

      <SectionTitle>Lote</SectionTitle>
      <Label>Lote *</Label>
      <ChipSelect options={f.lotesDeEstab} value={f.lote} onChange={f.setLote} />
      <Label>Cultivo</Label>
      <ChipSelect
        options={data?.cultivosRotacion ?? []}
        value={f.cultivo}
        onChange={f.setCultivo}
      />
      <Label>Producto</Label>
      <ChipSelect options={f.productosSegunLabor()} value={f.producto} onChange={f.setProducto} />

      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <FieldInput
            label="Dosis"
            value={f.dosis}
            onChangeText={f.setDosis}
            keyboardType="decimal-pad"
            placeholder="0.000"
          />
        </View>
        <View style={{ flex: 1 }}>
          <FieldInput
            label="Unidad"
            value={f.unidad}
            onChangeText={f.setUnidad}
            placeholder="Lts/ha"
          />
        </View>
      </View>

      <Button label="+ Agregar producto" onPress={f.addProducto} variant="outline" />
      {f.productosLote.map((p, i) => (
        <Text key={i} style={s.item}>
          · {p.producto} — {p.dosis} {p.unidad}
        </Text>
      ))}

      <Button label="✓ Confirmar lote" onPress={f.confirmarLote} variant="outline" />
      {f.lotes.map((l, i) => (
        <Text key={i} style={s.item}>
          ✓ {l.lote} ({l.productos.length} productos)
        </Text>
      ))}

      <Button label="Guardar en Planilla" onPress={f.guardar} loading={f.isPending} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: 60 },
  row: { flexDirection: 'row', gap: spacing.sm },
  item: { color: colors.textSecondary, marginTop: spacing.xs, paddingLeft: spacing.xs },
})
