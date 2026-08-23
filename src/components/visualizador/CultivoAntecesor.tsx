import { font, radius, spacing } from '@/constants/theme'
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
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffe082',
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  antText: { fontSize: font.sm, color: '#795548' },
  antStrong: { fontWeight: '700', color: '#5d4b00' },
})
