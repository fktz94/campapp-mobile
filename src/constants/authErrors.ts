import { isErrorWithCode, statusCodes } from 'react-native-nitro-google-signin'

export function formatGoogleSignInError(error: unknown, fallback = 'Unable to sign in.'): string {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services are not available.'

      case statusCodes.ONE_TAP_START_FAILED:
        return 'Google One Tap could not be started.'

      default:
        return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
