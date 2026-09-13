import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { Platform, StyleSheet, Text } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'
import { Button } from './Button'

interface Props {
  label: string
  value: Date
  onChange: (date: Date) => void
}

export function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>
}

export function DateField({ label, value, onChange }: Props) {
  const min = new Date(1994, 0, 1)
  const max = new Date()

  if (Platform.OS === 'android') {
    return (
      <>
        <Label>{label}</Label>
        <Button
          label={value.toLocaleDateString('es-AR')}
          variant="outline"
          onPress={() =>
            DateTimePickerAndroid.open({
              value,
              maximumDate: max,
              minimumDate: min,
              mode: 'date',
              onValueChange: (_, d) => d && onChange(d),
            })
          }
        />
      </>
    )
  }

  return (
    <>
      <Label>{label}</Label>
      <DateTimePicker
        value={value}
        mode="date"
        maximumDate={max}
        minimumDate={min}
        onValueChange={(_, d) => d && onChange(d)}
      />
    </>
  )
}

const s = StyleSheet.create({
  label: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
})
