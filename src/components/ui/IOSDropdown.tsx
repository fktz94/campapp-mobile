import { Host, Picker, Text as SwiftText } from '@expo/ui/swift-ui'
import { frame, lineLimit, pickerStyle, tag, truncationMode } from '@expo/ui/swift-ui/modifiers'
import { StyleSheet, Text, View } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'
import Dropdown from './Dropdown'

export default function iOSDropdown({ onChangeValue, selectedValue, values, label }: Dropdown) {
  return (
    <View style={s.container}>
      <Text style={s.label}>{label}</Text>
      <Host key={values.join('|')} matchContents>
        <Picker
          modifiers={[pickerStyle('menu')]}
          selection={selectedValue}
          onSelectionChange={(selection) => {
            onChangeValue(selection)
          }}
        >
          {values.map((val) => (
            <SwiftText
              key={val}
              modifiers={[tag(val), frame({ maxWidth: 160 }), lineLimit(1), truncationMode('tail')]}
            >
              {val}
            </SwiftText>
          ))}
        </Picker>
      </Host>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: font.sm,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.1,
  },
})
