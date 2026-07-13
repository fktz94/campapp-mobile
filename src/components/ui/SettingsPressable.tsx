import { Ionicons } from '@expo/vector-icons'
import { ColorValue } from 'react-native'
import { AnimatedPressable } from './AnimatedPressable'

const SettingsPressable = ({ color, size }: { color?: ColorValue; size: number }) => {
  return (
    <AnimatedPressable>
      <Ionicons name="settings-outline" size={size} color={color} />
    </AnimatedPressable>
  )
}

export default SettingsPressable
