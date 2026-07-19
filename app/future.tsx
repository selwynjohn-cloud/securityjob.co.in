import { StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NewsDesk } from '@/src/components/NewsDesk';
import { BigButton } from '@/src/components/BigButton';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

const ROLES = [
  'future.r1',
  'future.r2',
  'future.r3',
  'future.r4',
  'future.r5',
] as const;

export default function FutureScreen() {
  const router = useRouter();
  const { t } = useApp();
  const { speaking, speakAgain } = useGuideSpeech('future.spoken', true);

  return (
    <NewsDesk
      headline={t('future.headline')}
      ticker={t('future.ticker')}
      speaking={speaking}
      onHear={speakAgain}
    >
      <Text style={styles.lead}>{t('future.lead')}</Text>
      {ROLES.map((key) => (
        <View key={key} style={styles.row}>
          <Ionicons name="rocket" size={18} color={colors.gold} />
          <Text style={styles.rowText}>{t(key)}</Text>
        </View>
      ))}
      <Text style={styles.note}>{t('future.note')}</Text>
      <BigButton
        label={t('studio.chRegister')}
        onPress={() => router.push('/consent' as Href)}
        variant="gold"
      />
      <BigButton
        label={t('studio.chJobs')}
        onPress={() => router.push('/(main)/jobs' as Href)}
        variant="secondary"
      />
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
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  rowText: { flex: 1, color: 'rgba(255,255,255,0.92)', fontSize: 14, fontWeight: '600' },
  note: {
    color: colors.gold,
    fontWeight: '700',
    marginVertical: spacing.md,
    lineHeight: 20,
  },
});
