import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { StatusBar } from 'react-native'
import Toast from 'react-native-toast-message'

import Providers from '@/components/Providers'
import { useAuthSync } from '@/hooks/useAuthSync'
import { useAppStore } from '@/store/app'

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? ''

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useAuthSync()

  const { hydrated } = useAppStore()

  useEffect(() => {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID })
  }, [])

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hide()
    }
  }, [hydrated])

  if (!hydrated) return null

  return (
    <Providers>
      <StatusBar barStyle={'dark-content'} />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </Providers>
  )
}
