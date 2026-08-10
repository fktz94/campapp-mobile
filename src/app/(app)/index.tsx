import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ActivityIndicator } from 'react-native'

import { Button } from '@/components/ui/Button'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Label } from '@/components/ui/Label'
import { Screen } from '@/components/ui/Screen'
import { colors } from '@/constants/theme'
import { sheetsApi } from '@/lib/sheetsApi'
import { getDatosIniciales } from '@/lib/sheetsService'
import { useAppStore } from '@/store/app'

export default function HomeScreen() {
  const { user, campania, establecimiento, setCampania, setEstablecimiento } = useAppStore()

  const { data, isLoading } = useQuery({
    queryKey: ['datosIniciales'],
    queryFn: getDatosIniciales,
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
      <Button
        label="Test Sheets"
        onPress={async () => {
          try {
            const result = await sheetsApi.get<any>('Listas!A1:C5')
            console.log('RAW RESULT:', JSON.stringify(result, null, 2))
          } catch (e: any) {
            console.log('ERROR:', e.message)
          }
        }}
      />
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
