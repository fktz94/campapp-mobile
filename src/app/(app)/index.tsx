import { Link } from 'expo-router'
import { Text } from 'react-native'

import { Screen } from '@/components/ui/Screen'

export default function HomeScreen() {
  return (
    <Screen>
      <Link href={'/visualizador'} asChild>
        <Text>visualizador</Text>
      </Link>
    </Screen>
  )
}
