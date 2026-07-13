import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { GOOGLE_SIGN_IN_BUTTON_HEIGHT, GoogleSignInButton } from 'react-native-nitro-google-signin'

import { Screen } from '@/components/ui/Screen'
import { common } from '@/constants/commonStyles'
import { colors } from '@/constants/theme'
import useAuth from '@/hooks/useAuth'

const Login = () => {
  const { handleGoogleSignInSuccess, handleGoogleSignInError, isSigningIn } = useAuth()

  return (
    <>
      {isSigningIn && (
        <View style={s.loaderContainer}>
          <ActivityIndicator color={colors.primaryLight} size={'large'} />
        </View>
      )}
      <Screen centered>
        <Text style={common.title}>CampApp</Text>
        <GoogleSignInButton
          style={{ width: 320, height: GOOGLE_SIGN_IN_BUTTON_HEIGHT }}
          colorScheme="light"
          disabled={false}
          size="standard"
          signInBehavior="credentialManager"
          onSignInSuccess={({ idToken }) => handleGoogleSignInSuccess({ idToken })}
          onSignInError={handleGoogleSignInError}
        />
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
