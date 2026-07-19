import { useEffect } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NewsDesk } from '@/src/components/NewsDesk';
import { BigButton } from '@/src/components/BigButton';
import { AGILE_CONTACT } from '@/src/data/priya';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

const CHANNELS: {
  key: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  subKey: string;
}[] = [
  {
    key: 'company',
    route: '/company',
    icon: 'shield-checkmark',
    titleKey: 'studio.chCompany',
    subKey: 'studio.chCompanySub',
  },
  {
    key: 'jobs',
    route: '/(main)/jobs',
    icon: 'briefcase',
    titleKey: 'studio.chJobs',
    subKey: 'studio.chJobsSub',
  },
  {
    key: 'future',
    route: '/future',
    icon: 'calendar',
    titleKey: 'studio.chFuture',
    subKey: 'studio.chFutureSub',
  },
  {
    key: 'register',
    route: '/consent',
    icon: 'document-text',
    titleKey: 'studio.chRegister',
    subKey: 'studio.chRegisterSub',
  },
  {
    key: 'anthem',
    route: '/anthem',
    icon: 'musical-notes',
    titleKey: 'studio.chAnthem',
    subKey: 'studio.chAnthemSub',
  },
  {
    key: 'contact',
    route: '/contact',
    icon: 'call',
    titleKey: 'studio.chContact',
    subKey: 'studio.chContactSub',
  },
];

export default function HomeStudioScreen() {
  const router = useRouter();
  const { t, setGuide } = useApp();

  useEffect(() => {
    setGuide('female');
  }, [setGuide]);

  const { speaking, speakAgain } = useGuideSpeech('studio.spokenIntro', true);

  return (
    <NewsDesk
      headline={t('studio.headline')}
      ticker={t('studio.ticker')}
      speaking={speaking}
      onHear={speakAgain}
      showBack={false}
    >
      <Text style={styles.intro}>{t('studio.intro')}</Text>
      <Text style={styles.volume}>{t('studio.volumeHint')}</Text>

      <View style={styles.grid}>
        {CHANNELS.map((ch) => (
          <Pressable
            key={ch.key}
            style={styles.channel}
            onPress={() => router.push(ch.route as Href)}
          >
            <View style={styles.chIcon}>
              <Ionicons name={ch.icon} size={22} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chTitle}>{t(ch.titleKey)}</Text>
              <Text style={styles.chSub}>{t(ch.subKey)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gold} />
          </Pressable>
        ))}
      </View>

      <BigButton
        label={t('studio.startWithPriya')}
        onPress={() => router.push('/company' as Href)}
        variant="gold"
      />
      <Pressable
        style={styles.hotline}
        onPress={() => Linking.openURL(`tel:${AGILE_CONTACT.phone}`)}
      >
        <Ionicons name="call" size={18} color={colors.gold} />
        <Text style={styles.hotlineText}>{AGILE_CONTACT.phone}</Text>
      </Pressable>
    </NewsDesk>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  volume: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  grid: { gap: 10, marginBottom: spacing.md },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.navySecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(213,166,46,0.35)',
  },
  chIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chTitle: { color: colors.white, fontWeight: '800', fontSize: 15 },
  chSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  hotline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
  },
  hotlineText: { color: colors.gold, fontWeight: '800', fontSize: 16 },
});
