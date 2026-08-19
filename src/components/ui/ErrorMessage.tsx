import { StyleSheet, Text, View } from 'react-native'

import { colors, font, spacing } from '@/constants/theme'

const ErrorMessage = ({ message }: { message: string }) => (
  <View style={s.container}>
    <Text style={s.text}>{message}</Text>
  </View>
)

export default ErrorMessage

const s = StyleSheet.create({
  container: { padding: spacing.xl, alignItems: 'center' },
  text: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.error,
  },
})
