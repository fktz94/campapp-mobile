import { StyleSheet, Text } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'

export function SectionTitle({ children }: { children: string }) {
  return <Text style={s.text}>{children}</Text>
}

const s = StyleSheet.create({
  text: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
})
