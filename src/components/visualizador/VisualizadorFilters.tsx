import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import { colors, spacing } from '@/constants/theme'
import { useVisualizador } from '@/hooks/visualizador'
import Dropdown from '../ui/Dropdown'

export function VisualizadorFilters() {
  const {
    campania,
    establecimiento,
    lote,
    cultivo,
    view,
    campanias,
    establecimientos,
    lotes,
    cultivos,
    setCampania,
    setEstablecimiento,
    setLote,
    setCultivo,
    filtersLoading,
    filtersError,
  } = useVisualizador()

  if (filtersError) return <Text style={s.error}>No se pudieron cargar los filtros.</Text>

  const filters = [
    {
      key: 'campania',
      label: 'Campaña',
      values: campanias,
      selectedValue: campania,
      onChangeValue: setCampania,
      visible: true,
    },
    {
      key: 'establecimiento',
      label: 'Establecimiento',
      values: establecimientos,
      selectedValue: establecimiento,
      onChangeValue: setEstablecimiento,
      visible: view !== 'cultivo',
    },
    {
      key: 'lote',
      label: 'Lote',
      values: lotes,
      selectedValue: lote,
      onChangeValue: setLote,
      visible: view === 'lote',
    },
    {
      key: 'cultivo',
      label: 'Cultivos',
      values: cultivos,
      selectedValue: cultivo,
      onChangeValue: setCultivo,
      visible: view === 'cultivo',
    },
  ]

  return (
    <View style={s.container}>
      {filtersLoading ? (
        <ActivityIndicator style={s.spinner} />
      ) : (
        filters
          .filter((f) => f.visible)
          .map((f) => (
            <Dropdown
              key={f.key}
              values={f.values}
              selectedValue={f.selectedValue}
              onChangeValue={f.onChangeValue}
              label={f.label}
            />
          ))
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: colors.border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  spinner: { marginVertical: spacing.md },
  error: { color: colors.error, padding: spacing.md },
})
