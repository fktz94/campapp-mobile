import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'

import { auth, signOut } from '@/lib/auth/firebaseAuth'
import { useAppStore } from '@/store/app'

export const restoreGoogleSession = async (): Promise<boolean> => {
  const current = GoogleSignin.getCurrentUser()
  if (current) return true
  if (!GoogleSignin.hasPreviousSignIn()) return false
  try {
    await GoogleSignin.signInSilently()
    return true
  } catch {
    return false
  }
}

export const getSheetsAccessToken = async (invalidToken?: string): Promise<string> => {
  if (invalidToken) {
    try {
      await GoogleSignin.clearCachedAccessToken(invalidToken)
    } catch (e) {
      console.warn('No se pudo limpiar la caché del token de Google:', e)
    }
  }

  try {
    const { accessToken } = await GoogleSignin.getTokens()
    if (!accessToken) {
      throw new Error('No se pudo obtener un accessToken de Google válido.')
    }
    useAppStore.getState().setGoogleAccessToken(accessToken)
    return accessToken
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_REQUIRED) {
      throw new Error('SIGN_IN_REQUIRED')
    }
    throw e
  }
}

export const forceFullSignOut = async () => {
  try {
    await signOut(auth)
  } finally {
    await GoogleSignin.signOut()
  }
}
