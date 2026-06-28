import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'
import { Button } from './Button'
import { Label } from './Label'

interface Props {
  label: string
  value: Date
  onChange: (date: Date) => void
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
