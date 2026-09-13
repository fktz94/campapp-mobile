import { ScrollView } from 'react-native'

import { common } from '@/constants/commonStyles'
import { useVisualizadorContext } from '@/contexts/VisualizadorContext'
import type { VisualizadorView } from '@/lib/types/visualizador'
import ContenidoCultivo from './ContenidoCultivo'
import ContenidoEstablecimiento from './ContenidoEstablecimiento'
import ContenidoLote from './ContenidoLote'
import ContenidoRendimiento from './ContenidoRendimiento'

const VIEW_COMPONENTS: Record<VisualizadorView, React.ComponentType> = {
  lote: ContenidoLote,
  establecimiento: ContenidoEstablecimiento,
  cultivo: ContenidoCultivo,
  rendimiento: ContenidoRendimiento,
}

const VisualizadorContent = () => {
  const { view } = useVisualizadorContext()
  const Component = VIEW_COMPONENTS[view]
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={common.visualizadorContent}>
      <Component />
    </ScrollView>
  )
}

export default VisualizadorContent
