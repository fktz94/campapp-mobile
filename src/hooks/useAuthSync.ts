import { onAuthStateChanged } from '@react-native-firebase/auth'
import { useEffect } from 'react'

import { formatGoogleSignInError } from '@/constants/authErrors'
import { forceFullSignOut } from '@/lib/auth/authOrchestation'
import { auth } from '@/lib/auth/firebaseAuth'
import { getSheetsAccessToken, restoreGoogleSession } from '@/lib/auth/googleAuth'
import { useAppStore } from '@/store/app'

export const useAuthSync = () => {
  const setUser = useAppStore((s) => s.setUser)
  const setAuthError = useAppStore((s) => s.setAuthError)
  const setHydrated = useAppStore((s) => s.setHydrated)
  const setIsAuthenticating = useAppStore((s) => s.setIsAuthenticating)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setHydrated(true)
        return
      }
      setIsAuthenticating(true)
      try {
        const restored = await restoreGoogleSession()
        if (!restored) throw new Error('Google session unavailable')
        await getSheetsAccessToken()
        setUser(firebaseUser)
        setAuthError(null)
      } catch (error) {
        await forceFullSignOut()
        setUser(null)
        setAuthError(formatGoogleSignInError(error))
      } finally {
        setIsAuthenticating(false)
        setHydrated(true)
      }
    })
    return unsubscribe
  }, [])
}
