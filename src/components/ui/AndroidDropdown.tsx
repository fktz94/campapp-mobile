import {
  DropdownMenu,
  DropdownMenuItem,
  Host,
  OutlinedButton,
  Text,
} from '@expo/ui/jetpack-compose'
import { useState } from 'react'

import Dropdown from './Dropdown'

export default function AndroidDropdown({ onChangeValue, selectedValue, values, label }: Dropdown) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>{label}</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {values.map((val) => (
            <DropdownMenuItem
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
