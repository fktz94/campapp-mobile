import { StyleSheet } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'

export const common = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xl,
  },
})
