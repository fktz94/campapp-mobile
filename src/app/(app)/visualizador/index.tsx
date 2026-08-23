import { ChipSelect } from '@/components/ui/ChipSelect'
import { Screen } from '@/components/ui/Screen'
import { VisualizadorFilters } from '@/components/visualizador/VisualizadorFilters'
import { VIEWS } from '@/constants/views'
import { useVisualizador } from '@/hooks/visualizador'

export default function VisualizadorScreen() {
  const { view, setView } = useVisualizador()

  return (
    <Screen>
      <ChipSelect options={VIEWS} value={view} onChange={setView} />
      <VisualizadorFilters />
      {/* <VisualizadorContent /> */}
    </Screen>
  )
}
