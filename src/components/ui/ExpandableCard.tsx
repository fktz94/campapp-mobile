import { ReactNode, useEffect, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native'

import { colors, radius, spacing } from '@/constants/theme'

type ExpandableCardProps = {
  header: ReactNode
  children: ReactNode
  accentColor?: string
  accentColorPressed?: string
  showAccent?: boolean
  defaultOpen?: boolean
}

const ExpandableCard = ({
  header,
  children,
  accentColor = colors.primary,
  accentColorPressed,
  showAccent = true,
  defaultOpen = false,
}: ExpandableCardProps) => {
  const [isOpened, setIsOpened] = useState(defaultOpen)
  const [contentHeight, setContentHeight] = useState(0)

  const scaleAnim = useRef(new Animated.Value(1)).current
  const heightAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const opacityAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current
  const pressProgress = useRef(new Animated.Value(0)).current

  const pressedAccent = accentColorPressed ?? accentColor

  const onPressIn = () => {
    Animated.timing(pressProgress, { toValue: 1, duration: 200, useNativeDriver: false }).start()
    if (!isOpened) {
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 200, useNativeDriver: false }).start()
    }
  }

  const onPressOut = () => {
    Animated.timing(pressProgress, { toValue: 0, duration: 200, useNativeDriver: false }).start()
    if (!isOpened) {
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start()
    }
  }

  const toggleOpen = () => setIsOpened((prev) => !prev)

  useEffect(() => {
    if (contentHeight === 0) return
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isOpened ? contentHeight : 0,
        duration: isOpened ? 200 : 150,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: isOpened ? 1 : 0,
        duration: isOpened ? 200 : 150,
        useNativeDriver: false,
      }),
    ]).start()
  }, [isOpened, contentHeight, heightAnim, opacityAnim])

  const handleMeasure = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height)
    }
  }

  return (
    <Pressable onPress={toggleOpen} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          s.card,
          {
            backgroundColor: pressProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.surface, colors.surfacePressed],
            }),
            transform: [{ scale: scaleAnim }],
          },
          showAccent && {
            borderLeftWidth: 4,
            borderLeftColor: pressProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [accentColor, pressedAccent],
            }),
          },
        ]}
      >
        <View style={s.hiddenMeasurer} onLayout={handleMeasure} pointerEvents="none">
          <View style={s.body}>{children}</View>
        </View>
        <View style={s.header}>{header}</View>
        <Animated.View style={[s.bodyWrapper, { height: heightAnim, opacity: opacityAnim }]}>
          <View style={s.body}>{children}</View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}

export default ExpandableCard

const s = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'visible',
  },
  header: {
    padding: spacing.md,
  },
  bodyWrapper: {
    overflow: 'hidden',
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  hiddenMeasurer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
})
