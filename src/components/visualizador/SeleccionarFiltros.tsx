import { colors, font, spacing } from '@/constants/theme'
import { StyleSheet, Text } from 'react-native'

const SeleccionarFiltros = () => {
  return <Text style={s.text}>Seleccione los filtros para buscar información</Text>
}

export default SeleccionarFiltros

const s = StyleSheet.create({
  text: {
    fontSize: font.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
})
