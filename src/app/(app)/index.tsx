import { Href, router } from 'expo-router'
import { FlatList, View } from 'react-native'

import { MenuCard, MenuCardProps } from '@/components/ui/MenuCard'
import { Screen } from '@/components/ui/Screen'
import { spacing } from '@/constants/theme'

type MenuCardListItem = Omit<MenuCardProps, 'onPress'> & {
  href: Href
}

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
  )
}
