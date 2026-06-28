import { colors, font, spacing } from '@/constants/theme'
import { StyleSheet, Text } from 'react-native'

export function Label({ children }: { children: string }) {
  return <Text style={s.text}>{children}</Text>
}

const s = StyleSheet.create({
  text: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
})
