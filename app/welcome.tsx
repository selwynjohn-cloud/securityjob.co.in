import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigButton } from '@/src/components/BigButton';
import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import {
  fetchLiveVacancies,
  vacanciesSpokenSummary,
} from '@/src/services/vacancies';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

const LOGO = require('../assets/images/agile-group-logo.png');
const GUIDE = {
  male: require('../assets/images/male-agile-guide.png'),
  female: require('../assets/images/female-agile-guide.png'),
};

const SITE = 'https://www.securityjob.co.in';

const STATS = [
  { icon: 'shield-checkmark' as const, labelKey: 'welcome.statYears' },
  { icon: 'people' as const, labelKey: 'welcome.statGuards' },
  { icon: 'business' as const, labelKey: 'welcome.statClients' },
  { icon: 'gift' as const, labelKey: 'welcome.statFree' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, guide } = useApp();
  const gender = guide ?? 'female';

  const vacancyExtra = useCallback(async () => {
    const jobs = await fetchLiveVacancies();
    return vacanciesSpokenSummary(jobs);
  }, []);

  const { speaking, speakAgain, stop } = useGuideSpeech(
    'welcome.spoken',
    true,
    vacancyExtra,
  );

  const bubble = useMemo(() => t('welcome.message'), [t]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <LanguageSwitcher compact />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logoRing}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.company}>{t('welcome.company')}</Text>
          <Text style={styles.tagline}>{t('welcome.platformTagline')}</Text>
          <Pressable
            style={styles.sitePill}
            onPress={() => Linking.openURL(SITE)}
          >
            <Ionicons name="globe-outline" size={16} color={colors.navy} />
            <Text style={styles.siteText}>securityjob.co.in</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.labelKey} style={styles.stat}>
              <Ionicons name={s.icon} size={20} color={colors.gold} />
              <Text style={styles.statText}>{t(s.labelKey)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.liveRow}>
          <View style={[styles.livePill, speaking && styles.livePillOn]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              {speaking ? t('welcome.guardSpeakingLive') : t('welcome.guardReady')}
            </Text>
            {speaking ? (
              <ActivityIndicator color={colors.white} style={{ marginLeft: 6 }} />
            ) : null}
          </View>
        </View>

        <Pressable style={styles.stage} onPress={speakAgain}>
          <Image
            source={GUIDE[gender]}
            style={styles.guideImg}
            resizeMode="cover"
          />
          <View style={styles.logoOnScreen}>
            <Image source={LOGO} style={styles.logoOnScreenImg} resizeMode="contain" />
          </View>
          <View style={styles.hearPill}>
            <Ionicons name="volume-high" size={16} color={colors.white} />
            <Text style={styles.hearText}>
              {speaking ? t('welcome.guideSpeaking') : t('welcome.tapToHear')}
            </Text>
          </View>
        </Pressable>

        <View style={styles.bubble}>
          <View style={styles.bubbleArrow} />
          <Text style={styles.bubbleText}>{bubble}</Text>
        </View>

        <View style={styles.volumeHint}>
          <Ionicons name="volume-medium" size={18} color={colors.gold} />
          <Text style={styles.volumeText}>{t('welcome.volumeHint')}</Text>
        </View>

        <BigButton
          label={t('welcome.startRegistration')}
          onPress={() => {
            stop();
            router.push('/consent');
          }}
          variant="gold"
        />
        <BigButton
          label={t('welcome.seeJobs')}
          onPress={() => {
            stop();
            router.push('/(main)/jobs');
          }}
          variant="secondary"
        />
        <Pressable style={styles.webLink} onPress={() => Linking.openURL(SITE)}>
          <Ionicons name="open-outline" size={18} color={colors.gold} />
          <Text style={styles.webLinkText}>{t('welcome.openWebsite')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: 4 },
  scrollPad: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  brandBlock: { alignItems: 'center', marginBottom: spacing.md },
  logoRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  logo: { width: 88, height: 88 },
  company: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  sitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  siteText: { color: colors.navy, fontWeight: '800', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
    gap: 4,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  liveRow: { alignItems: 'flex-start', marginBottom: spacing.sm },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navySecondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(213,166,46,0.35)',
  },
  livePillOn: { backgroundColor: colors.red, borderColor: colors.red },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    marginRight: 8,
  },
  liveText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  stage: {
    height: 420,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: '#0a1628',
    marginBottom: spacing.md,
  },
  guideImg: { width: '100%', height: '100%' },
  logoOnScreen: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoOnScreenImg: { width: 42, height: 42 },
  hearPill: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(7,29,59,0.82)',
    paddingVertical: 10,
    borderRadius: 999,
  },
  hearText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bubbleArrow: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    left: '48%',
    width: 16,
    height: 16,
    backgroundColor: colors.white,
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    color: colors.navy,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  volumeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(213,166,46,0.45)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  volumeText: { color: 'rgba(255,255,255,0.85)', flex: 1, fontSize: 13, fontWeight: '600' },
  webLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  webLinkText: { color: colors.gold, fontWeight: '800', fontSize: 16 },
});
