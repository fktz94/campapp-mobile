import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'

const Banner = ({ label, value }: { value: string; label: string }) => {
  return (
    <View style={s.banner}>
      <Text style={s.bannerValue}>{value}</Text>
      <Text style={s.bannerLabel}>{label}</Text>
    </View>
  )
}

export default Banner

const s = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: '#81c784',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  bannerValue: { fontSize: font.lg, fontWeight: '700', color: '#1b5e20' },
  bannerLabel: {
    fontSize: font.sm - 2,
    color: '#388e3c',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 2,
  },
})
