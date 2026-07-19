import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { PRIYA } from '@/src/data/priya';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

const LOGO = require('../assets/images/agile-group-logo.png');

export default function SplashScreen() {
  const router = useRouter();
  const { t, setGuide } = useApp();

  return (
    <Screen showLanguage={false} navyHeader scroll={false} style={styles.body}>
      <View style={styles.hero}>
        <View style={styles.live}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>SECURITY JOB · LIVE DESK</Text>
        </View>
        <View style={styles.tvFrame}>
          <View style={styles.tvCorner}>
            <Image source={LOGO} style={styles.logoCorner} resizeMode="contain" />
            <Text style={styles.stamp}>
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.logoRing}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.company}>Agile Security Force</Text>
          <Text style={styles.tagline}>{t('welcome.platformTagline')}</Text>
          <Text style={styles.priya}>{PRIYA.displayLine}</Text>
        </View>

        <View style={styles.volumeCard}>
          <Ionicons name="volume-high" size={28} color={colors.gold} />
          <Text style={styles.volumeText}>{t('studio.volumeHint')}</Text>
        </View>
        <Text style={styles.nextHint}>{t('language.title')}</Text>
      </View>
      <View style={styles.footer}>
        <BigButton
          label={t('common.continue')}
          onPress={() => {
            setGuide('female');
            router.push('/language');
          }}
          variant="gold"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#040E1F',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: spacing.lg,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  liveText: { color: colors.white, fontWeight: '900', fontSize: 11, letterSpacing: 1 },
  tvFrame: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2A3340',
    borderRadius: 18,
    backgroundColor: '#0A1628',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tvCorner: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  logoCorner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  stamp: {
    marginTop: 4,
    color: colors.gold,
    fontWeight: '800',
    fontSize: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  logoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  logo: { width: 108, height: 108 },
  company: {
    ...typography.hero,
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 14,
  },
  priya: {
    color: colors.gold,
    fontWeight: '800',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  volumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: 'rgba(213,166,46,0.08)',
  },
  volumeText: {
    flex: 1,
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 21,
  },
  nextHint: {
    color: 'rgba(255,255,255,0.65)',
    marginTop: spacing.md,
    fontWeight: '600',
  },
  footer: { paddingBottom: spacing.md },
});
