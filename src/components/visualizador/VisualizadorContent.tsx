import { useVisualizador } from '@/hooks/visualizador'
import { VisualizadorParamKey, VisualizadorView } from '@/lib/types/visualizador'

import ContenidoCultivo from './ContenidoCultivo'
import ContenidoEstablecimiento from './ContenidoEstablecimiento'
import ContenidoLote from './ContenidoLote'
import ContenidoRendimiento from './ContenidoRendimiento'

type ViewConfig = {
  component: React.ComponentType<any>
  requiredParams: VisualizadorParamKey[]
}

const viewsConfig: Record<VisualizadorView, ViewConfig> = {
  lote: {
    component: ContenidoLote,
    requiredParams: ['campania', 'establecimiento', 'lote'],
  },
  establecimiento: {
    component: ContenidoEstablecimiento,
    requiredParams: ['campania', 'establecimiento'],
  },
  cultivo: {
    component: ContenidoCultivo,
    requiredParams: ['campania', 'cultivo'],
  },
  rendimiento: {
    component: ContenidoRendimiento,
    requiredParams: ['campania', 'establecimiento'],
  },
}

const VisualizadorContent = () => {
  const { view, ...params } = useVisualizador()
  const config = viewsConfig[view]
  if (!config) return null

  const missing = config.requiredParams.filter((key) => !params[key])
  if (missing.length) {
    const message = `Faltan parámetros: ${missing.join(', ')}`
    return
  }

  const componentProps = Object.fromEntries(config.requiredParams.map((key) => [key, params[key]]))

  const Component = config.component
  return <Component {...componentProps} />
}

export default VisualizadorContent
