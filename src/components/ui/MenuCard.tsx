import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

import { AnimatedPressable } from '@/components/ui/AnimatedPressable'
import { colors, font, radius, spacing } from '@/constants/theme'
import { MenuCardProps } from '@/lib/types/common'

export function MenuCard({ title, description, icon, onPress }: MenuCardProps) {
  return (
    <AnimatedPressable onPress={onPress}>
      <View style={s.card}>
        <View style={s.icon}>
          <Ionicons name={icon} size={28} color={colors.primary} />
        </View>
        <View style={s.content}>
          <Text style={s.title}>{title}</Text>
          {description && <Text style={s.description}>{description}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </AnimatedPressable>
  )
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.text,
  },

  description: {
    marginTop: spacing.xs,
    fontSize: font.sm,
    color: colors.textSecondary,
  },
})
