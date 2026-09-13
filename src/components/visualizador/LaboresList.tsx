import { StyleSheet, Text } from 'react-native'

import { colors, spacing } from '@/constants/theme'
import type { Bloque } from '@/lib/types/visualizador'
import LaborBody from './LaborBody'

const LaboresList = ({ bloques }: { bloques: Bloque[] }) => {
  return !bloques?.length ? (
    <Text style={s.empty}>
      No hay labores registradas para este lote en la campaña seleccionada.
    </Text>
  ) : (
    bloques.map((b, i) => <LaborBody b={b} key={`${b.fecha}-${b.labor}-${i}`} />)
  )
}

export default LaboresList

const s = StyleSheet.create({
  empty: {
    textAlign: 'center',
    padding: spacing.xl,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
})
