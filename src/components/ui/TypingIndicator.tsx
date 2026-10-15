import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { colors } from '@/constants/theme'

const DOT_SIZE = 8
const DURATION = 400

function Dot({ delay }: { delay: number }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: DURATION }), withTiming(0, { duration: DURATION })),
        -1 // infinite
      )
    )
  }, [delay, progress])

  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + progress.value * 0.7,
    transform: [{ translateY: -progress.value * 3 }],
  }))

  return <Animated.View style={[styles.dot, style]} />
}

export function TypingIndicator() {
  return (
    <View style={styles.row} accessibilityLabel="Escribiendo respuesta">
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 20, // same height as one line of text, so the bubble doesn't jump
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary, // or a muted gray
  },
})
