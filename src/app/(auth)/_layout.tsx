import { Redirect, Stack } from 'expo-router'

import { colors } from '@/constants/theme'
import { useAppStore } from '@/store/app'

export default function AuthLayout() {
  const user = useAppStore((s) => s.user)

  if (user) {
    return <Redirect href="/" />
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    />
  )
}
