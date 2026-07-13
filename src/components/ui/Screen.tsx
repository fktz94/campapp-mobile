// components/ui/Screen.tsx
import { common } from '@/constants/commonStyles'
import { StyleSheet, View, ViewProps } from 'react-native'

type Props = ViewProps & { centered?: boolean }

export function Screen({ style, centered, ...props }: Props) {
  return <View style={[common.screen, centered && s.centered, style]} {...props} />
}

const s = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
})
