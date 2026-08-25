import { Button, DropdownMenu, DropdownMenuItem, Host, Text } from '@expo/ui/jetpack-compose'
import { useState } from 'react'

import Dropdown from './Dropdown'

export default function AndroidDropdown({ onChangeValue, selectedValue, values, label }: Dropdown) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <Button onClick={() => setIsExpanded(true)}>
            <Text>{selectedValue ?? label}</Text>
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
                <Text>{val}</Text>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          ))}
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  )
}
