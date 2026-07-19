import { StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NewsDesk } from '@/src/components/NewsDesk';
import { BigButton } from '@/src/components/BigButton';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

const POINTS = [
  'company.p1',
  'company.p2',
  'company.p3',
  'company.p4',
  'company.p5',
  'company.p6',
  'company.p7',
  'company.p8',
] as const;

export default function CompanyScreen() {
  const router = useRouter();
  const { t } = useApp();
  const { speaking, speakAgain } = useGuideSpeech('company.spoken', true);

  return (
    <NewsDesk
      headline={t('company.headline')}
      ticker={t('company.ticker')}
      speaking={speaking}
      onHear={speakAgain}
    >
      <Text style={styles.lead}>{t('company.lead')}</Text>
      {POINTS.map((key) => (
        <View key={key} style={styles.point}>
          <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
          <Text style={styles.pointText}>{t(key)}</Text>
        </View>
      ))}
      <BigButton
        label={t('company.nextJobs')}
        onPress={() => router.push('/(main)/jobs' as Href)}
        variant="gold"
      />
      <BigButton
        label={t('studio.chRegister')}
        onPress={() => router.push('/consent' as Href)}
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
  point: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  pointText: {
    flex: 1,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
