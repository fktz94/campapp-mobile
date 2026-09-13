import { useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'

import { common } from '@/constants/commonStyles'
import { colors } from '@/constants/theme'
import { useVisualizadorContext } from '@/contexts/VisualizadorContext'
import { queryClient } from '@/lib/queryClient'
import { QUERY_KEYS } from '@/lib/queryKeys'
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

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      queryClient.refetchQueries({ queryKey: [QUERY_KEYS.catalogos] }),
      queryClient.refetchQueries({ queryKey: [QUERY_KEYS.operativo] }),
    ])
    setRefreshing(false)
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={common.visualizadorContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <Component />
    </ScrollView>
  )
}

export default VisualizadorContent
