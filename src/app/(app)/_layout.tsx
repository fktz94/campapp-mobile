import { Ionicons } from '@expo/vector-icons'
import { Redirect, router, Stack } from 'expo-router'
import { StyleSheet, Text } from 'react-native'

import { AnimatedPressable } from '@/components/ui/AnimatedPressable'
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
        headerRight: (props) => (
          <AnimatedPressable onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color={props.tintColor} />
          </AnimatedPressable>
        ),
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'CampoApp' }} />
      <Stack.Screen name="visualizador" options={{ title: 'Visualizador' }} />
      <Stack.Screen name="settings" options={{ title: 'Configuración', headerRight: () => null }} />
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
