import { View } from 'react-native'

import { Button } from '@/components/ui/Button'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Screen } from '@/components/ui/Screen'
import VisualizadorContent from '@/components/visualizador/VisualizadorContent'
import { VisualizadorFilters } from '@/components/visualizador/VisualizadorFilters'
import { VIEWS } from '@/constants/views'
import { useVisualizador } from '@/hooks/visualizador'

export default function VisualizadorScreen() {
  const { view, setView, isComplete } = useVisualizador()

  return (
    <Screen>
      <ChipSelect options={VIEWS} value={view} onChange={setView} />
      <VisualizadorFilters />
      <View style={{ flex: 1 }}>
        <VisualizadorContent />
      </View>
      <Button label="Buscar" onPress={() => {}} disabled={!isComplete} />
    </Screen>
  )
}
