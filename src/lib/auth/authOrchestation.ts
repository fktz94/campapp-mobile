import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { auth, signOut } from '@/lib/auth/firebaseAuth'

export const forceFullSignOut = async () => {
  try {
    await signOut(auth)
  } finally {
    await GoogleSignin.signOut()
  }
}
