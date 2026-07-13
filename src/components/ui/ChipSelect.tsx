import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'

interface Props {
  label?: string
  options: string[]
  value: string
  onChange: (v: string) => void
}

export function ChipSelect({ options, value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.row}>
      {options.map((o) => (
        <Pressable key={o} style={[s.chip, value === o && s.chipOn]} onPress={() => onChange(o)}>
          <Text style={[s.txt, value === o && s.txtOn]}>{o}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  row: { marginTop: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  txt: { fontSize: font.sm, color: colors.text },
  txtOn: { color: colors.surface, fontWeight: '600' },
})
