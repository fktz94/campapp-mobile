import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin'
import { useCallback, useState } from 'react'

import { formatGoogleSignInError } from '@/constants/authErrors'
import { auth, GoogleAuthProvider, signInWithCredential, signOut } from '@/lib/firebaseAuth'
import { useAppStore } from '@/store/app'

const useAuth = () => {
  const setAuthError = useAppStore((s) => s.setAuthError)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const exchangeGoogleToken = useCallback(async (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken)
    await signInWithCredential(auth, credential)
  }, [])

  const signIn = useCallback(async () => {
    try {
      setIsSigningIn(true)
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken
        if (!idToken) {
          throw new Error('No ID token returned from Google Sign-In.')
        }
        await exchangeGoogleToken(idToken)
        setAuthError(null)
      }
    } catch (error) {
      console.error('google sign in', error)
      setAuthError(formatGoogleSignInError(error))
    } finally {
      setIsSigningIn(false)
    }
  }, [exchangeGoogleToken, setAuthError])

  const signOutUser = useCallback(async () => {
    try {
      await signOut(auth)
    } finally {
      await GoogleSignin.signOut()
      setAuthError(null)
    }
  }, [setAuthError])

  return {
    signIn,
    isSigningIn,
    signOut: signOutUser,
  }
}

export default useAuth
