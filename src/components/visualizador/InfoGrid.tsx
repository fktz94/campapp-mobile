import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'
import { InfoGridProps } from '@/lib/types/visualizador'

const InfoGrid: React.FC<InfoGridProps> = ({ cards }) => {
  return (
    <View style={s.infoGrid}>
      {cards.map((card, cardIndex) => (
        <View key={cardIndex} style={s.infoCard}>
          <Text style={[s.infoValue, card.infoValueSmall && s.infoValueSmall]}>{card.value}</Text>
          <Text style={s.infoLabel}>{card.label}</Text>
        </View>
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radius.md,
    alignItems: 'center',
    maxWidth: '40%',
    height: 85,
    paddingBottom: spacing.lg,
    justifyContent: 'flex-end',
    gap: 4,
  },
  infoValue: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  infoValueSmall: {
    fontSize: font.md,
    marginBottom: 3,
    paddingHorizontal: 5,
  },
  infoLabel: {
    fontSize: font.sm - 1,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})

export default InfoGrid
