import { ReactNode, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRIYA } from '../data/priya';
import { colors } from '../theme/colors';
import { spacing } from '../theme/typography';
import { LanguageSwitcher } from './LanguageSwitcher';

const PRIYA_IMG = require('../../assets/images/female-agile-guide.png');
const LOGO = require('../../assets/images/agile-group-logo.png');

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function formatTvStamp(d: Date): string {
  const day = d.getDate();
  const mon = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${year} · ${hh}:${mm}`;
}

interface Props {
  children: ReactNode;
  headline: string;
  ticker?: string;
  speaking?: boolean;
  onHear?: () => void;
  showBack?: boolean;
  showLanguage?: boolean;
}

/** Interactive TV news desk frame with SG. Priya */
export function NewsDesk({
  children,
  headline,
  ticker,
  speaking,
  onHear,
  showBack = true,
  showLanguage = true,
}: Props) {
  const router = useRouter();
  const [stamp, setStamp] = useState(() => formatTvStamp(new Date()));

  useEffect(() => {
    const tick = () => setStamp(formatTvStamp(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          {showBack ? (
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </Pressable>
          ) : (
            <View style={styles.iconBtn} />
          )}
          {showLanguage ? <LanguageSwitcher compact /> : null}
        </View>

        <View style={styles.liveChip}>
          <View style={[styles.dot, speaking && styles.dotHot]} />
          <Text style={styles.liveText}>
            {speaking ? 'ON AIR' : 'SECURITY JOB NEWS'}
          </Text>
        </View>

        <View style={styles.brandStamp}>
          <Text style={styles.datestamp} numberOfLines={1}>
            {stamp}
          </Text>
          <View style={styles.logoBadge}>
            <Image source={LOGO} style={styles.logoCorner} resizeMode="contain" />
          </View>
        </View>
      </View>

      <View style={styles.headlineBar}>
        <Text style={styles.headline} numberOfLines={2}>
          {headline}
        </Text>
      </View>

      <View style={styles.desk}>
        <Pressable style={styles.anchor} onPress={onHear} disabled={!onHear}>
          <Image source={PRIYA_IMG} style={styles.priya} resizeMode="cover" />
          <View style={styles.namePlate}>
            <Text style={styles.name}>{PRIYA.name}</Text>
            <Text style={styles.idNo}>Id.No. {PRIYA.idNo}</Text>
          </View>
          {onHear ? (
            <View style={styles.hearFab}>
              <Ionicons
                name={speaking ? 'radio' : 'volume-high'}
                size={16}
                color={colors.navy}
              />
              <Text style={styles.hearFabText}>
                {speaking ? 'Speaking…' : 'Tap to hear'}
              </Text>
            </View>
          ) : null}
        </Pressable>
        <ScrollView
          style={styles.panel}
          contentContainerStyle={styles.panelContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>

      {ticker ? (
        <View style={styles.ticker}>
          <Text style={styles.tickerLabel}>BREAKING</Text>
          <Text style={styles.tickerText} numberOfLines={1}>
            {ticker}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#040E1F' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 88,
    gap: 2,
  },
  iconBtn: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center' },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 8,
    flexShrink: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  dotHot: { backgroundColor: colors.gold },
  liveText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  brandStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  datestamp: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.15,
    textAlign: 'right',
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoCorner: { width: 38, height: 38 },
  headlineBar: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headline: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  desk: { flex: 1, paddingHorizontal: spacing.md, gap: spacing.sm },
  anchor: {
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.navySecondary,
  },
  priya: { width: '100%', height: '100%' },
  namePlate: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7,29,59,0.88)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  name: { color: colors.white, fontWeight: '900', fontSize: 16 },
  idNo: { color: colors.gold, fontWeight: '700', fontSize: 12, marginTop: 2 },
  hearFab: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  hearFabText: { color: colors.navy, fontWeight: '800', fontSize: 12 },
  panel: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(213,166,46,0.35)',
  },
  panelContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  ticker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    gap: 8,
  },
  tickerLabel: {
    backgroundColor: colors.red,
    color: colors.white,
    fontWeight: '900',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  tickerText: { flex: 1, color: colors.navy, fontWeight: '800', fontSize: 12 },
});
