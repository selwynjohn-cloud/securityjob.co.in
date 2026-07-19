import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NewsDesk } from '@/src/components/NewsDesk';
import { BigButton } from '@/src/components/BigButton';
import { AGILE_CONTACT, getGuide } from '@/src/data/guides';
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

/** Channel labels ship with an inline "1. " prefix for reuse on other screens;
 *  strip it here so it isn't doubled beside the visible number badge. */
function stripLeadNumber(label: string): string {
  return label.replace(/^\s*\d+[.)]\s*/, '');
}

export default function HomeStudioScreen() {
  const router = useRouter();
  const { t, guide, audioOnly } = useApp();
  const active = getGuide(guide);
  const deskScript =
    active.gender === 'male' ? 'studio.spokenIntroMale' : 'studio.spokenIntroFemale';
  const { speaking, speakAgain } = useGuideSpeech(deskScript, true);

  return (
    <NewsDesk
      headline=""
      ticker={t('studio.ticker')}
      speaking={speaking}
      onHear={speakAgain}
      showBack={false}
      showLanguage={false}
      showBrandHeader
    >
      {!audioOnly ? (
        <>
          <Text style={styles.welcomeLine}>
            {t('studio.welcomeBy', { name: active.name })}
          </Text>
          <Text style={styles.intro}>{t('studio.intro')}</Text>
          <Text style={styles.whyTitle}>{t('studio.whyJoinTitle')}</Text>
          <Text style={styles.whyBody}>{t('studio.whyJoinBody')}</Text>
          <Text style={styles.jumpHint}>{t('studio.jumpHint')}</Text>
        </>
      ) : null}

      <View style={styles.grid}>
        {CHANNELS.map((ch, i) => (
          <Pressable
            key={ch.key}
            style={styles.channel}
            onPress={() => router.push(ch.route as Href)}
            accessibilityRole="button"
            accessibilityLabel={`${i + 1}. ${stripLeadNumber(t(ch.titleKey))}`}
          >
            <View style={styles.chNumber}>
              <Text style={styles.chNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.chIcon}>
              <Ionicons name={ch.icon} size={20} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chTitle}>{stripLeadNumber(t(ch.titleKey))}</Text>
              <Text style={styles.chSub}>{t(ch.subKey)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gold} />
          </Pressable>
        ))}
      </View>

      <BigButton
        label={t('studio.startWithGuide')}
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
  welcomeLine: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  intro: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  whyTitle: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  whyBody: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  jumpHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
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
  chNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navy,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chNumberText: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 16,
  },
  chIcon: {
    width: 36,
    height: 36,
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
