import { Button, DropdownMenu, DropdownMenuItem, Host, Text } from '@expo/ui/jetpack-compose'
import { width } from '@expo/ui/jetpack-compose/modifiers'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import Dropdown from './Dropdown'

export default function AndroidDropdown({
  onChangeValue,
  selectedValue,
  values,
  label = '',
}: Dropdown) {
  const [isExpanded, setIsExpanded] = useState(false)
  const displayValue = selectedValue || label

  return (
    <View style={s.container}>
      <Host matchContents={{ vertical: true }} style={s.host}>
        <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
          <DropdownMenu.Trigger>
            <Button onClick={() => setIsExpanded(true)}>
              <Text
                maxLines={1}
                overflow="ellipsis"
                style={{ textAlign: 'center' }}
                modifiers={[width(180)]}
              >
                {displayValue}
              </Text>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Items>
            {values.map((val) => (
              <DropdownMenuItem
                key={val}
                onClick={() => {
                  setIsExpanded(false)
                  onChangeValue(val)
                }}
              >
                <DropdownMenuItem.Text>
                  <Text maxLines={1} overflow="ellipsis" modifiers={[width(220)]}>
                    {val}
                  </Text>
                </DropdownMenuItem.Text>
              </DropdownMenuItem>
            ))}
          </DropdownMenu.Items>
        </DropdownMenu>
      </Host>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  host: { width: '100%' },
})
