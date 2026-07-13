import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const Container = Animated.createAnimatedComponent(Pressable)

type Props = {
  children: React.ReactNode
  hitSlop?: number
  onPress?: () => void
}

export function AnimatedPressable({ onPress, children, hitSlop = 10 }: Props) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Container
      onPress={onPress}
      hitSlop={hitSlop}
      onPressIn={() => {
        scale.value = withSpring(0.85, { damping: 15, stiffness: 300 })
        opacity.value = withSpring(0.4, { damping: 15, stiffness: 300 })
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 })
        opacity.value = withSpring(1, { damping: 15, stiffness: 300 })
      }}
      style={animatedStyle}
    >
      {children}
    </Container>
  )
}
