import { Ionicons } from '@expo/vector-icons'
import { ColorValue } from 'react-native'

import { AnimatedPressable } from './AnimatedPressable'

const SettingsPressable = ({
  color,
  size,
  onPress,
}: {
  color?: ColorValue
  size: number
  onPress?: () => void
}) => {
  return (
    <AnimatedPressable onPress={onPress}>
      <Ionicons name="settings-outline" size={size} color={color} />
    </AnimatedPressable>
  )
}

export default SettingsPressable
