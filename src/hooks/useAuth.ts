import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'
import { useCallback } from 'react'

import { formatGoogleSignInError } from '@/constants/authErrors'
import { auth, GoogleAuthProvider, signInWithCredential } from '@/lib/auth/firebaseAuth'
import { forceFullSignOut, getSheetsAccessToken } from '@/lib/auth/googleAuth'
import { showAuthError } from '@/lib/helpers/auth'
import { useAppStore } from '@/store/app'

const useAuth = () => {
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
      }
    } catch (error) {
      showAuthError(formatGoogleSignInError(error))
    } finally {
      setIsAuthenticating(false)
    }
  }, [setIsAuthenticating])

  const signOutUser = useCallback(async () => {
    await forceFullSignOut()
  }, [])

  return { signIn, signOut: signOutUser }
}

export default useAuth
