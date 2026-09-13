import { colors, font, spacing } from '@/constants/theme'
import { StyleSheet, Text } from 'react-native'

const ContenidoVacio = ({ type }: { type: string }) => {
  return <Text style={s.text}>No hay información para el {type} buscado</Text>
}

export default ContenidoVacio

const s = StyleSheet.create({
  text: {
    fontSize: font.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
})
