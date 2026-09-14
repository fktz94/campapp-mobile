import { ActivityIndicator } from 'react-native'

import { useVisualizadorContext } from '@/contexts/VisualizadorContext'
import { VisualizadorView } from '@/lib/types/visualizador'
import ContenidoVacio from './ContenidoVacio'
import SeleccionarFiltros from './SeleccionarFiltros'

interface Props {
  isLoading: boolean
  hasData: boolean
  view: VisualizadorView
}

function ContenidoGuard({ isLoading, hasData, view }: Props) {
  const { isComplete, filtersLoading } = useVisualizadorContext()

  if (filtersLoading) return null
  if (isLoading) return <ActivityIndicator />
  if (!isComplete) return <SeleccionarFiltros />
  if (!hasData) return <ContenidoVacio type={view} />

  return null
}

export default ContenidoGuard
