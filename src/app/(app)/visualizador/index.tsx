import { ChipSelect } from '@/components/ui/ChipSelect'
import { Screen } from '@/components/ui/Screen'
import VisualizadorContent from '@/components/visualizador/VisualizadorContent'
import { VisualizadorFilters } from '@/components/visualizador/VisualizadorFilters'
import { VIEWS } from '@/constants/views'
import { useVisualizadorContext, VisualizadorProvider } from '@/contexts/VisualizadorContext'

function VisualizadorScreenInner() {
  const { view, setView } = useVisualizadorContext()
  return (
    <Screen>
      <ChipSelect options={VIEWS} value={view} onChange={setView} />
      <VisualizadorFilters />
      <VisualizadorContent />
    </Screen>
  )
}

export default function VisualizadorScreen() {
  return (
    <VisualizadorProvider>
      <VisualizadorScreenInner />
    </VisualizadorProvider>
  )
}
