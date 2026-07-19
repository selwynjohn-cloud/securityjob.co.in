import { ReactNode, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/typography';
import { BrandHeader } from './BrandHeader';
import { GuideStage, passportSize } from './GuideStage';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${day} ${mon} ${year}\n${hh}:${mm}:${ss}`;
}

interface Props {
  children: ReactNode;
  headline: string;
  ticker?: string;
  speaking?: boolean;
  onHear?: () => void;
  showBack?: boolean;
  showLanguage?: boolean;
  /** Continue Agile brand header above the TV bezel */
  showBrandHeader?: boolean;
}

/** Interactive TV news desk — aligned portrait guide + channels */
export function NewsDesk({
  children,
  headline,
  ticker,
  speaking,
  onHear,
  showBack = true,
  showLanguage = true,
  showBrandHeader = false,
}: Props) {
  const router = useRouter();
  const { width: winW } = useWindowDimensions();
  const [stamp, setStamp] = useState(() => formatTvStamp(new Date()));
  const isWide = winW >= 720;

  const { width: stageW, height: stageH } = passportSize(isWide ? 250 : 230);

  useEffect(() => {
    const tick = () => setStamp(formatTvStamp(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      {showBrandHeader ? (
        <View style={styles.brandHeaderPad}>
          <BrandHeader showStats compact />
        </View>
      ) : null}
      <View style={styles.bezel}>
        {!showBrandHeader ? (
          <>
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
                <Text style={styles.liveText}>{speaking ? 'ON AIR' : 'LIVE'}</Text>
              </View>

              <View style={styles.topRightSpacer} />
            </View>

            {headline ? (
              <View style={styles.headlineBar}>
                <Text style={styles.network}>SECURITY JOB NEWS</Text>
                <Text style={styles.headline} numberOfLines={2}>
                  {headline}
                </Text>
              </View>
            ) : null}
          </>
        ) : showBack || showLanguage ? (
          <View style={styles.topBarSlim}>
            {showBack ? (
              <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
                <Ionicons name="arrow-back" size={22} color={colors.white} />
              </Pressable>
            ) : (
              <View style={styles.iconBtn} />
            )}
            {showLanguage ? <LanguageSwitcher compact /> : null}
          </View>
        ) : null}

        <View style={[styles.body, isWide && styles.bodyWide]}>
          <View style={[styles.stageWrap, isWide && styles.stageWrapWide]}>
            <GuideStage
              width={stageW}
              height={stageH}
              speaking={speaking}
              onPress={onHear}
              showStamp={stamp}
            />
          </View>

          <ScrollView
            style={[styles.panel, isWide && styles.panelWide]}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#020810' },
  brandHeaderPad: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.navy,
  },
  topBarSlim: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  bezel: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#1a2a44',
    backgroundColor: '#040E1F',
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    borderRadius: 4,
    gap: 8,
    flexShrink: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  dotHot: { backgroundColor: colors.gold },
  liveText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  topRightSpacer: { minWidth: 88 },
  headlineBar: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213,166,46,0.25)',
  },
  network: {
    color: colors.red,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headline: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  body: { flex: 1 },
  bodyWide: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  stageWrap: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  stageWrapWide: {
    paddingTop: spacing.md,
  },
  panel: {
    flex: 1,
    marginHorizontal: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.navy,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(213,166,46,0.35)',
  },
  panelWide: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: spacing.sm,
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
