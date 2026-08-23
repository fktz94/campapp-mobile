import { Ionicons } from '@expo/vector-icons'
import { Href } from 'expo-router'

export interface MenuCardProps {
  title: string
  description?: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

export type MenuCardListItem = Omit<MenuCardProps, 'onPress'> & {
  href: Href
}
