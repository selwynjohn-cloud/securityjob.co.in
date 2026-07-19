import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BigButton } from '@/src/components/BigButton';
import { BrandHeader } from '@/src/components/BrandHeader';
import { GuideStage, passportSize } from '@/src/components/GuideStage';
import { getGuide, pickRandomGuide } from '@/src/data/guides';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { LANGUAGE_OPTIONS } from '@/src/i18n/languages';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';
import type { LanguageCode } from '@/src/types';

/**
 * Cinematic welcome — the guide is the star, almost no reading.
 * A spotlight sits the guide centre-stage; the voice speaks the brand and
 * instructions while the UI stays to language + Continue. Three intentional
 * motions only: a gentle entrance, a voice-linked halo, and a footer rise.
 */
export default function SplashScreen() {
  const router = useRouter();
  const { t, guide, setGuide, language, setLanguage, setAudioOnly } = useApp();
  const active = getGuide(guide);
  const { width: stageW, height: stageH } = passportSize(260);

  const [langOpen, setLangOpen] = useState(false);
  const [readySpeak, setReadySpeak] = useState(false);

  const selected =
    LANGUAGE_OPTIONS.find((o) => o.code === language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    setGuide(pickRandomGuide());
    setAudioOnly(true);
    const tmr = setTimeout(() => setReadySpeak(true), 400);
    return () => clearTimeout(tmr);
  }, [setGuide, setAudioOnly]);

  const introKey =
    active.gender === 'male' ? 'splash.spokenIntroMale' : 'splash.spokenIntroFemale';

  // Pass a plain string (not a function) so Start Audio stays inside Safari's
  // user-gesture window. A () => Promise path previously silenced web TTS.
  const { speaking, speakAgain, stop } = useGuideSpeech(
    introKey,
    readySpeak,
    t('splash.spokenBody'),
  );

  // Motion 1 — gentle entrance: the guide fades and scales up on open.
  const enter = useSharedValue(0);
  useEffect(() => {
    enter.value = withTiming(1, { duration: 850, easing: Easing.out(Easing.cubic) });
  }, [enter]);
  const stageStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.92 + enter.value * 0.08 }],
  }));

  // Motion 2 — voice-linked halo: a soft gold glow breathes only while speaking,
  // so the visitor can *see* the guide is talking to them.
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (speaking) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 350 });
    }
    return () => cancelAnimation(pulse);
  }, [speaking, pulse]);
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + pulse.value * 0.42,
    transform: [{ scale: 1 + pulse.value * 0.12 }],
  }));

  const pickLang = (code: LanguageCode) => {
    setLanguage(code);
    setLangOpen(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.cinema}>
        <BrandHeader showStats={false} compact />

        <View style={styles.stageWrap}>
          <View style={styles.spotlight} pointerEvents="none" />
          <Animated.View style={stageStyle}>
            <View style={styles.stageInner}>
              <Animated.View style={[styles.halo, haloStyle]} pointerEvents="none" />
              <GuideStage
                width={stageW}
                height={stageH}
                speaking={speaking}
                onPress={speakAgain}
              />
            </View>
          </Animated.View>
          <Pressable onPress={speakAgain} hitSlop={8} style={styles.hearRow}>
            <Ionicons
              name={speaking ? 'volume-high' : 'volume-medium-outline'}
              size={16}
              color={colors.gold}
            />
            <Text style={styles.hearText}>{t('splash.tapToHear')}</Text>
          </Pressable>
        </View>

        <Animated.View entering={FadeInUp.delay(450).duration(650)}>
          <Pressable
            style={styles.dropdown}
            onPress={() => setLangOpen(true)}
            accessibilityLabel={t('language.selectLanguage')}
          >
            <Ionicons name="language" size={20} color={colors.gold} />
            <Text style={styles.dropdownValue} numberOfLines={1}>
              {selected.englishName}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.gold} />
          </Pressable>

          <View style={styles.footer}>
            <BigButton
              label={t('common.continue')}
              onPress={() => {
                stop();
                router.replace('/home' as Href);
              }}
              variant="gold"
            />
          </View>
        </Animated.View>
      </View>

      <Modal visible={langOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setLangOpen(false)}>
          <View style={styles.modalCard}>
            {LANGUAGE_OPTIONS.map((opt) => {
              const on = opt.code === language;
              return (
                <Pressable
                  key={opt.code}
                  style={[styles.modalRow, on && styles.modalRowOn]}
                  onPress={() => pickLang(opt.code)}
                >
                  <Text style={[styles.modalRowText, on && styles.modalRowTextOn]}>
                    {opt.englishName}
                  </Text>
                  <Text style={[styles.modalRowNative, on && styles.modalRowTextOn]}>
                    {opt.nativeLabel}
                  </Text>
                  {on ? (
                    <Ionicons name="checkmark-circle" size={22} color={colors.gold} />
                  ) : (
                    <View style={{ width: 22 }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#020810' },
  cinema: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  stageWrap: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  stageInner: { alignItems: 'center', justifyContent: 'center' },
  /** Soft cinematic pool of light behind the guide */
  spotlight: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: 'rgba(16,47,87,0.9)',
    opacity: 0.55,
  },
  /** Voice-linked gold glow — breathes while the guide speaks */
  halo: {
    position: 'absolute',
    top: -18,
    bottom: 34,
    left: -22,
    right: -22,
    borderRadius: 200,
    backgroundColor: colors.gold,
  },
  hearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  hearText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16,47,87,0.95)',
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: spacing.sm,
  },
  dropdownValue: {
    flex: 1,
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  footer: { paddingBottom: spacing.xs },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: spacing.md,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  modalRowOn: { backgroundColor: 'rgba(213,166,46,0.15)' },
  modalRowText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
    width: 100,
  },
  modalRowNative: {
    flex: 1,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    fontSize: 15,
  },
  modalRowTextOn: { color: colors.gold },
});
