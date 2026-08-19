import { Stack } from 'expo-router'
import { View } from 'react-native'

import { ChipSelect } from '@/components/ui/ChipSelect'
import { Screen } from '@/components/ui/Screen'
import VisualizadorContent from '@/components/visualizador/VisualizadorContent'
import { VIEWS } from '@/constants/views'
import { useVisualizador } from '@/hooks/visualizador'

export default function VisualizadorScreen() {
  const { view, setView } = useVisualizador()

  return (
    <>
      <Stack.Screen options={{ title: 'Visualizador' }} />
      <Screen>
        <View>
          <ChipSelect options={VIEWS} value={view} onChange={setView} />
        </View>
        <VisualizadorContent />
      </Screen>
    </>
  )
}
