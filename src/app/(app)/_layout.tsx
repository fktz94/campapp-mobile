import { Redirect, Stack } from 'expo-router'

import { colors, font, spacing } from '@/constants/theme'
import { useAppStore } from '@/store/app'
import { StyleSheet, Text } from 'react-native'

export default function AppLayout() {
  const user = useAppStore((s) => s.user)

  if (!user) {
    return <Redirect href="/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerTitle: (props) => <Text style={s.text}>{props.children}</Text>,
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
  )
}

const s = StyleSheet.create({
  text: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
})
