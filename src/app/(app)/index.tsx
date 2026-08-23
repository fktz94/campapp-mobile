import { router, Stack } from 'expo-router'
import { FlatList, View } from 'react-native'

import { MenuCard } from '@/components/ui/MenuCard'
import { Screen } from '@/components/ui/Screen'
import SettingsPressable from '@/components/ui/SettingsPressable'
import { spacing } from '@/constants/theme'
import { MenuCardListItem } from '@/lib/types/common'

const CARDS: MenuCardListItem[] = [
  {
    description: 'Consulta información de lotes, establecimientos y cultivos',
    title: 'Visualizador',
    icon: 'analytics-outline',
    href: '/visualizador',
  },
]

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'CampApp',
          headerRight(props) {
            return (
              <SettingsPressable
                color={props.tintColor}
                size={22}
                onPress={() => router.push('/settings')}
              />
            )
          },
        }}
      />
      <Screen>
        <FlatList
          style={{ marginVertical: spacing.lg }}
          data={CARDS}
          keyExtractor={(item) => item.href.toString()}
          ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
          renderItem={({ item }) => (
            <MenuCard
              title={item.title}
              description={item.description}
              icon={item.icon}
              onPress={() => router.push(item.href)}
            />
          )}
        />
      </Screen>
    </>
  )
}
