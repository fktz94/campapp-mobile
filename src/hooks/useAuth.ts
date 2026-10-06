import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'
import { useCallback } from 'react'

import { formatGoogleSignInError } from '@/constants/authErrors'
import { loginWithGoogle } from '@/lib/api/auth'
import { clearSession } from '@/lib/auth/session'
import { showAuthError } from '@/lib/helpers/auth'
import { useAppStore } from '@/store/app'

const useAuth = () => {
  const setIsAuthenticating = useAppStore((s) => s.setIsAuthenticating)
  const setUser = useAppStore((s) => s.setUser)
  const setBackendToken = useAppStore((s) => s.setBackendToken)
  const setGoogleAccessToken = useAppStore((s) => s.setGoogleAccessToken)

  const signIn = useCallback(async () => {
    try {
      setIsAuthenticating(true)
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken

        const tokens = await GoogleSignin.getTokens()
        const googleAccessToken = tokens.accessToken

        if (!idToken || !googleAccessToken) {
          throw new Error('No ID Token or Access Token returned.')
        }

        const { backendToken, user } = await loginWithGoogle(idToken)

        setGoogleAccessToken(googleAccessToken)
        setBackendToken(backendToken)
        setUser(user)
      }
    } catch (error) {
      showAuthError(formatGoogleSignInError(error))
    } finally {
      setIsAuthenticating(false)
    }
  }, [setIsAuthenticating, setUser, setBackendToken])

  const signOutUser = useCallback(async () => {
    try {
      await GoogleSignin.signOut()
    } catch (error) {
      console.warn('Google sign-out warning:', error)
    } finally {
      clearSession()
    }
  }, [setBackendToken, setUser])

  return { signIn, signOut: signOutUser }
}

export default useAuth
