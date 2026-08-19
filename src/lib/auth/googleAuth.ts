import { GoogleSignin } from '@react-native-google-signin/google-signin'

export const restoreGoogleSession = async (): Promise<boolean> => {
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

  const { accessToken } = await GoogleSignin.getTokens()
  if (!accessToken) {
    throw new Error('No se pudo obtener un accessToken de Google válido.')
  }

  return accessToken
}
