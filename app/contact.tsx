import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsDesk } from '@/src/components/NewsDesk';
import { AGILE_CONTACT } from '@/src/data/priya';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

export default function ContactScreen() {
  const { t } = useApp();
  const { speaking, speakAgain } = useGuideSpeech('contact.spoken', true);

  return (
    <NewsDesk
      headline={t('contact.headline')}
      ticker={t('contact.ticker')}
      speaking={speaking}
      onHear={speakAgain}
    >
      <Text style={styles.lead}>{t('contact.lead')}</Text>

      <Pressable
        style={styles.card}
        onPress={() => Linking.openURL(`tel:${AGILE_CONTACT.phone}`)}
      >
        <Ionicons name="call" size={24} color={colors.navy} />
        <View>
          <Text style={styles.label}>{t('contact.phone')}</Text>
          <Text style={styles.value}>{AGILE_CONTACT.phone}</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => Linking.openURL(`mailto:${AGILE_CONTACT.email}`)}
      >
        <Ionicons name="mail" size={24} color={colors.navy} />
        <View>
          <Text style={styles.label}>{t('contact.email')}</Text>
          <Text style={styles.value}>{AGILE_CONTACT.email}</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => Linking.openURL(AGILE_CONTACT.site)}
      >
        <Ionicons name="globe" size={24} color={colors.navy} />
        <View>
          <Text style={styles.label}>{t('contact.website')}</Text>
          <Text style={styles.value}>securityjob.co.in</Text>
        </View>
      </Pressable>

      <Text style={styles.thanks}>{t('contact.visitThanks')}</Text>
    </NewsDesk>
  );
}

const styles = StyleSheet.create({
  lead: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.gold,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  label: { color: colors.navy, fontWeight: '700', fontSize: 12, opacity: 0.8 },
  value: { color: colors.navy, fontWeight: '900', fontSize: 16, marginTop: 2 },
  thanks: {
    color: colors.gold,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 22,
  },
});
