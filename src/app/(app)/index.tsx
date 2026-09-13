import { Ionicons } from '@expo/vector-icons'
import { Href, router, Stack } from 'expo-router'
import { FlatList, View } from 'react-native'

import { AnimatedPressable } from '@/components/ui/AnimatedPressable'
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
    <>
      <Stack.Screen
        options={{
          title: 'CampoApp',
          headerRight: (props) => (
            <AnimatedPressable onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={22} color={props.tintColor} />
            </AnimatedPressable>
          ),
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
