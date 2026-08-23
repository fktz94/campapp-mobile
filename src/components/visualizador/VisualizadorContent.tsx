import { VIEW_REQUIRED_PARAMS } from '@/constants/visualizadorViews'
import { useVisualizador } from '@/hooks/visualizador'
import { VisualizadorView } from '@/lib/types/visualizador'

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
  const { view, ...params } = useVisualizador()
  const requiredParams = VIEW_REQUIRED_PARAMS[view]
  const Component = VIEW_COMPONENTS[view]

  const missing = requiredParams.filter((key) => !params[key])
  if (missing.length > 0) return null

  const componentProps = Object.fromEntries(requiredParams.map((key) => [key, params[key]]))

  return <Component {...componentProps} />
}

export default VisualizadorContent
