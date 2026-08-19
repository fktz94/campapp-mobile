import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import useAuth from '@/hooks/useAuth'
import { Stack } from 'expo-router'

const SettingsScreen = () => {
  const { signOut } = useAuth()
  return (
    <>
      <Stack.Screen options={{ title: 'Configuración' }} />
      <Screen centered>
        <Button onPress={signOut} variant="outline" label="Cerrar sesión" />
      </Screen>
    </>
  )
}

export default SettingsScreen
