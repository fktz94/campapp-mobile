import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'
import { useCallback } from 'react'

import { formatGoogleSignInError } from '@/constants/authErrors'
import { forceFullSignOut } from '@/lib/auth/authOrchestation'
import { auth, GoogleAuthProvider, signInWithCredential } from '@/lib/auth/firebaseAuth'
import { getSheetsAccessToken } from '@/lib/auth/googleAuth'
import { useAppStore } from '@/store/app'

const useAuth = () => {
  const setAuthError = useAppStore((s) => s.setAuthError)
  const setIsAuthenticating = useAppStore((s) => s.setIsAuthenticating)

  const signIn = useCallback(async () => {
    try {
      setIsAuthenticating(true)
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()
      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken
        if (!idToken) {
          throw new Error('No ID token returned from Google Sign-In.')
        }
        const accessToken = await getSheetsAccessToken()
        const credential = GoogleAuthProvider.credential(idToken, accessToken)
        await signInWithCredential(auth, credential)
        setAuthError(null)
      }
    } catch (error) {
      setAuthError(formatGoogleSignInError(error))
    } finally {
      setIsAuthenticating(false)
    }
  }, [setAuthError, setIsAuthenticating])

  const signOutUser = useCallback(async () => {
    try {
      await forceFullSignOut()
    } finally {
      setAuthError(null)
    }
  }, [setAuthError])

  return { signIn, signOut: signOutUser }
}

export default useAuth
