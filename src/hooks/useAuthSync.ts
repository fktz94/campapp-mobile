import { auth } from '@/lib/firebaseAuth'
import { useAppStore } from '@/store/app'
import { onAuthStateChanged } from '@react-native-firebase/auth'
import { useEffect } from 'react'

export const useAuthSync = () => {
  const setUser = useAppStore((s) => s.setUser)
  const setHydrated = useAppStore((s) => s.setHydrated)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setHydrated(true)
    })
    return unsubscribe
  }, [])
}
