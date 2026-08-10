import { isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'

export function formatGoogleSignInError(error: unknown, fallback = 'Unable to sign in.'): string {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.IN_PROGRESS:
        return 'A sign-in request is already in progress.'

      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services are not available.'

      case statusCodes.NULL_PRESENTER:
        return 'Unable to present the sign-in screen. Please try again.'

      default:
        return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
