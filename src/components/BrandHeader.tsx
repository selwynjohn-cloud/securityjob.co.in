import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/typography';
import { useApp } from '../store/AppContext';

const LOGO = require('../../assets/images/agile-group-logo.png');
const JOB_SITE = 'https://www.securityjob.co.in';
const GROUP_SITE = 'https://www.agilegroup.co.in';

const STATS = [
  { icon: 'shield-checkmark' as const, labelKey: 'welcome.statYears' },
  { icon: 'people' as const, labelKey: 'welcome.statGuards' },
  { icon: 'location' as const, labelKey: 'welcome.statLocations' },
  { icon: 'gift' as const, labelKey: 'welcome.statFree' },
];

interface Props {
  showStats?: boolean;
  compact?: boolean;
}

/** Agile header — company, job portal promise, and group link */
export function BrandHeader({ showStats = true, compact = false }: Props) {
  const { t } = useApp();

  return (
    <View style={styles.wrap}>
      <View style={[styles.logoRing, compact && styles.logoRingCompact]}>
        <Image
          source={LOGO}
          style={[styles.logo, compact && styles.logoCompact]}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.company, compact && styles.companyCompact]}>
        {t('welcome.company')}
      </Text>
      <Text style={styles.legalName}>{t('welcome.legalName')}</Text>

      <Text style={styles.tagline}>{t('welcome.platformTagline')}</Text>
      <Text style={styles.promise}>{t('welcome.promiseLine')}</Text>

      <Pressable style={styles.sitePill} onPress={() => Linking.openURL(JOB_SITE)}>
        <Ionicons name="globe-outline" size={16} color={colors.navy} />
        <Text style={styles.siteText}>SecurityJob.co.in</Text>
      </Pressable>

      <Pressable onPress={() => Linking.openURL(GROUP_SITE)} hitSlop={8}>
        <Text style={styles.groupLink}>{t('welcome.discoverServices')}</Text>
      </Pressable>

      {showStats ? (
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.labelKey} style={styles.stat}>
              <Ionicons name={s.icon} size={18} color={colors.gold} />
              <Text style={styles.statText}>{t(s.labelKey)}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.md },
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
  logoRingCompact: { width: 72, height: 72, borderRadius: 36 },
  logo: { width: 88, height: 88 },
  logoCompact: { width: 64, height: 64 },
  company: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  companyCompact: { fontSize: 20 },
  legalName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  tagline: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  promise: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: spacing.md,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  sitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: spacing.sm,
  },
  siteText: { color: colors.navy, fontWeight: '800', fontSize: 14 },
  groupLink: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: spacing.md,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
