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

export const getSheetsAccessToken = async (): Promise<string> => {
  const { accessToken } = await GoogleSignin.getTokens()
  return accessToken
}
