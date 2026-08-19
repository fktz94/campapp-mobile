import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { StatusBar } from 'react-native'

import { useAuthSync } from '@/hooks/useAuthSync'
import { queryClient } from '@/lib/queryClient'
import { useAppStore } from '@/store/app'

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? ''

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useAuthSync()

  const { hydrated } = useAppStore()

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
  }, [])

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hide()
    }
  }, [hydrated])

  if (!hydrated) return null

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle={'dark-content'} />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
