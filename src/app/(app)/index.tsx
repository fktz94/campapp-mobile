import { Link, router, Stack } from 'expo-router'
import { Text, View } from 'react-native'

import { AnimatedPressable } from '@/components/ui/AnimatedPressable'
import { Screen } from '@/components/ui/Screen'
import SettingsPressable from '@/components/ui/SettingsPressable'

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
        <Link href={'/visualizador'} asChild>
          <AnimatedPressable>
            <View style={{ backgroundColor: 'lightblue' }}>
              <Text style={{ borderWidth: 1, flexGrow: 0 }}>visualizador</Text>
            </View>
          </AnimatedPressable>
        </Link>
      </Screen>
    </>
  )
}
