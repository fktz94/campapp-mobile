// components/ui/Screen.tsx
import { common } from '@/constants/commonStyles'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = ViewProps & { centered?: boolean }

export function Screen({ style, centered, ...props }: Props) {
  const { bottom } = useSafeAreaInsets()
  return (
    <View
      style={[{ paddingBottom: bottom }, common.screen, centered && s.centered, style]}
      {...props}
    />
  )
}

const s = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
})
