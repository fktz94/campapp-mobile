import { StyleSheet, Text, View } from 'react-native'

import { colors, font, radius, spacing } from '@/constants/theme'
import type { Card } from '@/lib/types/visualizador'

const InfoGrid = ({ cards }: { cards: Card[] }) => {
  return (
    <View style={s.infoGrid}>
      {cards.map((card, cardIndex) => (
        <View key={cardIndex} style={s.infoCard}>
          <View style={s.valueContainer}>
            <Text style={[s.infoValue, card.infoValueSmall && s.infoValueSmall]}>{card.value}</Text>
          </View>
          <View style={s.labelContainer}>
            <Text style={s.infoLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
              {card.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export default InfoGrid

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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  valueContainer: {
    minHeight: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelContainer: {
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },

  infoLabel: {
    fontSize: font.sm - 1,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
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
})
