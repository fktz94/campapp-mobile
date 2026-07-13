import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'

interface Props {
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline'
  loading?: boolean
  disabled?: boolean
}

export function Button({ label, onPress, variant = 'primary', loading, disabled }: Props) {
  return (
    <Pressable
      style={[s.btn, variant === 'outline' && s.outline, (disabled || loading) && s.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.surface} />
      ) : (
        <Text style={[s.txt, variant === 'outline' && s.txtOutline]}>{label}</Text>
      )}
    </Pressable>
  )
}

const s = StyleSheet.create({
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  disabled: { opacity: 0.4 },
  txt: { color: colors.surface, fontWeight: '700', fontSize: font.lg },
  txtOutline: { color: colors.primary },
})
