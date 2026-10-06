import { Image, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { colors, font } from '@/constants/theme'
import useAuth from '@/hooks/useAuth'
import { useAppStore } from '@/store/app'

const SettingsScreen = () => {
  const { signOut } = useAuth()
  const user = useAppStore((s) => s.user)

  return (
    <Screen>
      <View style={{ height: '60%', alignItems: 'center', paddingTop: 16 }}>
        <Text style={s.name}>{user?.name}</Text>
        <Image source={require('@/assets/images/icon.png')} style={s.image} />
      </View>
      <Button onPress={signOut} variant="outline" label="Cerrar sesión" />
    </Screen>
  )
}

export default SettingsScreen

const s = StyleSheet.create({
  name: {
    fontSize: font.lg,
    color: colors.primaryDark,
  },
  image: {
    width: 150,
    height: 150,
    margin: 'auto',
  },
})
