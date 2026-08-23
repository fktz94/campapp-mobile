import { Redirect, Stack } from 'expo-router'

import { SectionTitle } from '@/components/ui/SectionTitle'
import { useAppStore } from '@/store/app'

export default function AppLayout() {
  const user = useAppStore((s) => s.user)

  if (!user) {
    return <Redirect href="/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerTitle(props) {
          return <SectionTitle>{props.children}</SectionTitle>
        },
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
  )
}
