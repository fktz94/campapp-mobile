import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'

const Banner = ({
  label,
  value,
  containerStyle,
}: {
  value: string
  label: string
  containerStyle?: StyleProp<ViewStyle>
}) => {
  return (
    <View style={[s.banner, containerStyle]}>
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
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: 4,
    justifyContent: 'space-around',
  },
  bannerValue: { fontSize: font.lg, fontWeight: '700', color: '#1b5e20', textAlign: 'center' },
  bannerLabel: {
    fontSize: font.sm - 2,
    color: '#388e3c',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 2,
    textAlign: 'center',
  },
})
