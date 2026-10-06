import { useEffect } from 'react'

import { fetchProfile } from '@/lib/api/auth'
import { clearSession } from '@/lib/auth/session'
import { useAppStore } from '@/store/app'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

export const useAuthSync = () => {
  const setBackendToken = useAppStore((s) => s.setBackendToken)
  const setUser = useAppStore((s) => s.setUser)
  const setHydrated = useAppStore((s) => s.setHydrated)
  const setGoogleAccessToken = useAppStore((s) => s.setGoogleAccessToken)

  useEffect(() => {
    const initSession = async () => {
      const token = useAppStore.getState().backendToken

      if (!token) {
        setUser(null)
        setHydrated(true)
        return
      }

      try {
        const { user, token: freshToken } = await fetchProfile()
        if (freshToken) {
          setBackendToken(freshToken)
        }
        setUser(user)

        const tokens = await GoogleSignin.getTokens()

        if (tokens?.accessToken) {
          setGoogleAccessToken(tokens.accessToken)
        }
      } catch {
        clearSession()
      } finally {
        setHydrated(true)
      }
    }

    initSession()
  }, [setUser, setHydrated])
}
