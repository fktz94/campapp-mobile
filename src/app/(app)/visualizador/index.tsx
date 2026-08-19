import { View } from 'react-native'

import { ChipSelect } from '@/components/ui/ChipSelect'
import { Screen } from '@/components/ui/Screen'
import { SectionTitle } from '@/components/ui/SectionTitle'
import VisualizadorContent from '@/components/visualizador/VisualizadorContent'
import { VIEWS } from '@/constants/views'
import { useVisualizador } from '@/hooks/visualizador'

export default function VisualizadorScreen() {
  const { view, setView } = useVisualizador()

  return (
    <Screen>
      <SectionTitle>Visualizador</SectionTitle>
      <View>
        <ChipSelect options={VIEWS} value={view} onChange={setView} />
      </View>
      <VisualizadorContent />
    </Screen>
  )
}
