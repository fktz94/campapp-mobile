import { getApp } from '@react-native-firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth'

const app = getApp()
export const auth = getAuth(app)

export { GoogleAuthProvider, signInWithCredential, signOut }
