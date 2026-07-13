import { Link, Redirect, Stack, useSegments } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import SettingsPressable from '@/components/ui/SettingsPressable'
import { useAppStore } from '@/store/app'

export default function AppLayout() {
  const user = useAppStore((s) => s.user)
  const segments = useSegments()
  const isSettings = segments[segments.length - 1] === 'settings'
  const { bottom } = useSafeAreaInsets()

  if (!user) {
    return <Redirect href="/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerRight: isSettings
          ? undefined
          : ({ tintColor }) => (
              <Link href="/settings" asChild>
                <SettingsPressable color={tintColor} size={22} />
              </Link>
            ),
        contentStyle: { paddingBottom: bottom },
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
  )
}
