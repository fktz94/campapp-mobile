import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import useAuth from '@/hooks/useAuth'

const SettingsScreen = () => {
  const { signOut } = useAuth()
  return (
    <Screen centered>
      <Button onPress={signOut} variant="outline" label="sign out" />
    </Screen>
  )
}

export default SettingsScreen
