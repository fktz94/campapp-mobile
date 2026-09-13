import { colors, font, radius, spacing } from '@/constants/theme'
import { StyleSheet, Text, View } from 'react-native'

const CultivoAntecesor = ({
  campañaAntecesor,
  cultivoAntecesor,
}: {
  cultivoAntecesor: string
  campañaAntecesor: string
}) => {
  return (
    <View style={s.antBadge}>
      <Text style={s.antText}>
        Antecesor <Text style={s.antStrong}>{campañaAntecesor}</Text>: {cultivoAntecesor}
      </Text>
    </View>
  )
}

export default CultivoAntecesor

const s = StyleSheet.create({
  antBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.highlightBg,
    borderWidth: 1,
    borderColor: colors.highlightBorder,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  antText: { fontSize: font.sm, color: colors.highlightText },
  antStrong: { fontWeight: '700', color: colors.highlightTextStrong },
})
