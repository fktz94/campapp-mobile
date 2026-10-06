import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import { Screen } from '@/components/ui/Screen'
import { common } from '@/constants/commonStyles'
import { colors } from '@/constants/theme'
import useAuth from '@/hooks/useAuth'
import { useAppStore } from '@/store/app'

const Login = () => {
  const { signIn } = useAuth()
  const isAuthenticating = useAppStore((s) => s.isAuthenticating)

  return (
    <>
      {isAuthenticating && (
        <View style={s.loaderContainer}>
          <ActivityIndicator color={colors.primaryLight} size={'large'} />
        </View>
      )}
      <Screen centered>
        <Text style={common.title}>CampoApp</Text>
        <GoogleSigninButton onPress={signIn} />
      </Screen>
    </>
  )
}

export default Login

const s = StyleSheet.create({
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#00000099',
  },
})
