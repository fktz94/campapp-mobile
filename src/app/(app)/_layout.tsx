import { Redirect, Stack } from 'expo-router'
import { StyleSheet, Text } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'
import { useAppStore } from '@/store/app'

export default function AppLayout() {
  const user = useAppStore((s) => s.user)

  if (!user) {
    return <Redirect href="/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerTitle: ({ children }) => <Text style={s.text}>{children}</Text>,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="visualizador" options={{ title: 'Visualizador' }} />
    </Stack>
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
