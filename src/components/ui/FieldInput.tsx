import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'

interface Props extends TextInputProps {
  label: string
}

export function FieldInput({ label, ...props }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} placeholderTextColor={colors.textMuted} {...props} />
    </View>
  )
}

const s = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  label: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: font.md,
    color: colors.text,
  },
})
