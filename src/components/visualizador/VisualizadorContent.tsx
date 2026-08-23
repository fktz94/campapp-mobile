import { common } from '@/constants/commonStyles'
import { useVisualizador } from '@/hooks/visualizador/useVisualizador'
import { VisualizadorView } from '@/lib/types/visualizador'
import { ScrollView } from 'react-native'
import ContenidoCultivo from './ContenidoCultivo'
import ContenidoEstablecimiento from './ContenidoEstablecimiento'
import ContenidoLote from './ContenidoLote'
import ContenidoRendimiento from './ContenidoRendimiento'

const VIEW_COMPONENTS: Record<VisualizadorView, React.ComponentType<any>> = {
  lote: ContenidoLote,
  establecimiento: ContenidoEstablecimiento,
  cultivo: ContenidoCultivo,
  rendimiento: ContenidoRendimiento,
}

const VisualizadorContent = () => {
  const { view } = useVisualizador()
  const Component = VIEW_COMPONENTS[view]
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={common.visualizadorContent}>
      <Component />
    </ScrollView>
  )
}

export default VisualizadorContent
