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

  const isAuthReady = useAppStore((s) => s.isAuthReady)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
  }, [])

  useEffect(() => {
    if (isAuthReady) {
      SplashScreen.hide()
    }
  }, [isAuthReady])

  if (!isAuthReady) return null

  return (
    <Providers>
      <StatusBar barStyle={'dark-content'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      <Toast />
    </Providers>
  )
}
