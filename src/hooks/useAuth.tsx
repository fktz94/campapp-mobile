import { useCallback, useState } from 'react'
import { GoogleOneTapSignIn } from 'react-native-nitro-google-signin'

import { formatGoogleSignInError } from '@/constants/authErrors'
import { auth, GoogleAuthProvider, signInWithCredential, signOut } from '@/lib/firebaseAuth'
import { useAppStore } from '@/store/app'

const useAuth = () => {
  const setAuthError = useAppStore((s) => s.setAuthError)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleGoogleSignInSuccess = useCallback(
    async ({ idToken }: { idToken: string }) => {
      try {
        setIsSigningIn(true)
        const credential = GoogleAuthProvider.credential(idToken)
        await signInWithCredential(auth, credential)
        setAuthError(null)
      } catch (error) {
        console.error('google log in', error)
        setAuthError(formatGoogleSignInError(error))
      } finally {
        setIsSigningIn(false)
      }
    },
    [setAuthError]
  )

  const handleGoogleSignInError = useCallback(
    (error: unknown) => {
      setAuthError(formatGoogleSignInError(error))
    },
    [setAuthError]
  )

  const signOutUser = useCallback(async () => {
    await signOut(auth)
    await GoogleOneTapSignIn.signOut()
  }, [])

  return {
    handleGoogleSignInSuccess,
    handleGoogleSignInError,
    isSigningIn,
    signOut: signOutUser,
  }
}

export default useAuth
