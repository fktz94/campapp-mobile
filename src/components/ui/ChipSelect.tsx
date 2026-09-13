import { useRef } from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'

interface Option<T extends string = string> {
  label: string
  value: T
}

interface Props<T extends string> {
  options: readonly Option<T>[]
  value: T
  onChange: (v: T) => void
}

export function ChipSelect<T extends string>({ options, value, onChange }: Props<T>) {
  const scrollRef = useRef<ScrollView>(null)
  const scrollViewWidth = useRef(0)

  const chipLayouts = useRef<Map<T, { x: number; width: number }>>(new Map())
  const initialScrollDone = useRef(false)

  const handleScroll = (option: T) => {
    const layout = chipLayouts.current.get(option)

    if (!layout || !scrollRef.current || scrollViewWidth.current === 0) return

    const { x, width: chipWidth } = layout
    const targetX = Math.max(0, x - (scrollViewWidth.current - chipWidth) / 2)

    scrollRef.current.scrollTo({
      x: targetX,
      animated: true,
    })
  }

  const tryInitialScroll = () => {
    if (initialScrollDone.current) return

    if (!chipLayouts.current.has(value) || value === options[0].value) return
    if (scrollViewWidth.current === 0) return

    initialScrollDone.current = true
    requestAnimationFrame(() => {
      handleScroll(value)
    })
  }

  const handlePress = (option: T) => {
    onChange(option)
    handleScroll(option)
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={s.container}
      contentContainerStyle={s.row}
      onLayout={(event) => {
        scrollViewWidth.current = event.nativeEvent.layout.width
        tryInitialScroll()
      }}
    >
      {options.map((o) => (
        <Pressable
          key={o.value}
          style={[s.chip, value === o.value && s.chipOn]}
          onPress={() => handlePress(o.value)}
          onLayout={(event) => {
            const { x, width } = event.nativeEvent.layout

            chipLayouts.current.set(o.value, { x, width })

            if (o.value === value) {
              tryInitialScroll()
            }
          }}
        >
          <Text style={[s.txt, value === o.value && s.txtOn]}>{o.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}
const s = StyleSheet.create({
  container: { marginVertical: spacing.lg, flexGrow: 0 },
  row: { alignItems: 'flex-start' },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  txt: { fontSize: font.sm, color: colors.text },
  txtOn: { color: colors.surface, fontWeight: '600' },
})
