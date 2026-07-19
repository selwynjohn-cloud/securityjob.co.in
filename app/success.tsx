import { StyleSheet, Text, View, Image } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { PRIYA, AGILE_CONTACT } from '@/src/data/priya';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

const LOGO = require('../assets/images/agile-group-logo.png');

export default function SuccessScreen() {
  const router = useRouter();
  const { t, profile } = useApp();
  useGuideSpeech('success.spoken', true);

  return (
    <Screen title={t('success.title')} showLanguage navyHeader>
      <View style={styles.hero}>
        <View style={styles.logoRing}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <Ionicons name="checkmark-circle" size={64} color={colors.gold} />
        <Text style={styles.thanks}>
          {t('success.thankYou', { name: profile.name || 'Candidate' })}
        </Text>
        <Text style={styles.followUp}>{t('success.followUp')}</Text>
        <Text style={styles.priya}>{PRIYA.displayLine}</Text>
        <Text style={styles.regLabel}>{t('success.regNumber')}</Text>
        <Text style={styles.regNum}>{profile.registrationNumber ?? '—'}</Text>
      </View>

      <Text style={styles.ask}>{t('success.askAnthem')}</Text>
      <BigButton
        label={t('success.yesAnthem')}
        onPress={() => router.push('/anthem' as Href)}
        variant="gold"
      />
      <BigButton
        label={t('success.viewJobs')}
        onPress={() => router.replace('/(main)/jobs')}
        variant="secondary"
      />
      <BigButton
        label={t('success.finalThanks')}
        onPress={() => router.push('/contact' as Href)}
        variant="outline"
      />
      <Text style={styles.hotline}>
        {AGILE_CONTACT.phone} · {AGILE_CONTACT.email}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  logo: { width: 64, height: 64 },
  thanks: {
    ...typography.bodyLarge,
    textAlign: 'center',
    color: colors.white,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  followUp: {
    ...typography.body,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.sm,
  },
  priya: { color: colors.gold, fontWeight: '800', marginTop: spacing.sm },
  regLabel: { ...typography.label, textAlign: 'center', color: colors.gold, marginTop: spacing.md },
  regNum: {
    ...typography.title,
    textAlign: 'center',
    color: colors.white,
    marginTop: 4,
  },
  ask: {
    ...typography.bodyLarge,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  hotline: {
    textAlign: 'center',
    color: colors.navySecondary,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  finalThanks: {},
});
