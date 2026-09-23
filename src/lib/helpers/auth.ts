import Toast from 'react-native-toast-message'

export const showAuthError = (authError: string) => {
  Toast.show({
    type: 'error',
    text1: 'Error de autenticación',
    text2: authError,
    position: 'bottom',
  })
}
