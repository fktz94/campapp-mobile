import Toast from 'react-native-toast-message'

export const showChatError = (chatError: string) => {
  Toast.show({
    type: 'error',
    text1: 'OpenAI error',
    text2: chatError,
    position: 'bottom',
  })
}
