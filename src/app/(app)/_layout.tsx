import { Redirect, Stack } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { useAppStore } from '@/store/app'

export default function AppLayout() {
  const user = useAppStore((s) => s.user)
  const { bottom } = useSafeAreaInsets()

  if (!user) {
    return <Redirect href="/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerTitle(props) {
          return <SectionTitle>{props.children}</SectionTitle>
        },
        contentStyle: { paddingBottom: bottom },
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
  )
}
