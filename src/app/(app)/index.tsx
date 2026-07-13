import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ActivityIndicator } from 'react-native'

import { Button } from '@/components/ui/Button'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Label } from '@/components/ui/Label'
import { Screen } from '@/components/ui/Screen'
import { colors } from '@/constants/theme'
import { api } from '@/lib/api'
import { useAppStore } from '@/store/app'

export default function HomeScreen() {
  const { user, campania, establecimiento, setCampania, setEstablecimiento } = useAppStore()

  const { data, isLoading } = useQuery({
    queryKey: ['datosIniciales'],
    queryFn: api.getDatosIniciales,
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  })

  if (isLoading)
    return (
      <Screen centered>
        <ActivityIndicator color={colors.text} />
      </Screen>
    )

  return (
    <Screen>
      <Label>Campaña</Label>
      <ChipSelect options={data?.campanias ?? []} value={campania ?? ''} onChange={setCampania} />

      <Label>Establecimiento</Label>
      <ChipSelect
        options={data?.establecimientos ?? []}
        value={establecimiento ?? ''}
        onChange={setEstablecimiento}
      />

      <Button
        label="Cargar Labor"
        onPress={() => router.push('/labores/orden')}
        disabled={!campania || !establecimiento}
      />
    </Screen>
  )
}
