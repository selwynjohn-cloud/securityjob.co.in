import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  QUESTION_OPTIONS,
  REGISTRATION_QUESTIONS,
} from '../data/registrationQuestions';
import {
  DETECTED_LANGUAGE_LABELS,
  speechService,
} from '../services/speech';
import {
  whisperToSitePrimaryLanguage,
  whisperToUiLanguage,
} from '../services/languageDetect';
import { stopTalking, talkAsGuide } from '../services/tts';
import { validateField } from '../services/validation';
import { useApp } from '../store/AppContext';
import { useSpeechPlayback } from '../store/SpeechPlayback';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/typography';
import type { GuideGender } from '../types';
import { BigButton } from './BigButton';
import { LanguageSwitcher } from './LanguageSwitcher';

const GUIDE_IMG = {
  male: require('../../assets/images/male-agile-guide.png'),
  female: require('../../assets/images/female-agile-guide.png'),
};

type Phase = 'talking' | 'ready' | 'listening' | 'processing' | 'review';

interface Props {
  onFinished: () => void;
}

function optionLabel(
  opt: { value: string; label?: string; labelKey?: string },
  t: (k: string) => string,
) {
  return opt.label ?? (opt.labelKey ? t(opt.labelKey) : opt.value);
}

export function TalkingGuideSession({ onFinished }: Props) {
  const {
    t,
    guide,
    language,
    speechMode,
    profile,
    setProfileField,
    setLanguage,
  } = useApp();
  const { setReplay, releaseReplay } = useSpeechPlayback();
  const gender: GuideGender = guide ?? 'female';

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('talking');
  const [draft, setDraft] = useState('');
  const [detected, setDetected] = useState<string | null>(null);
  const [showType, setShowType] = useState(false);
  const sessionId = useRef(0);
  const langMapped = useRef(false);

  const question = REGISTRATION_QUESTIONS[index];
  const questionText = t(`questions.${String(question.id)}`);
  const options = question.optionsKey
    ? QUESTION_OPTIONS[question.optionsKey] ?? []
    : [];
  const isPhoto = question.inputType === 'photo';

  const applyLanguageDetect = useCallback(
    (code?: string) => {
      if (!code) return;
      const siteLang = whisperToSitePrimaryLanguage(code);
      if (siteLang && !profile.language) {
        setProfileField('language', siteLang);
      }
      if (!langMapped.current) {
        const ui = whisperToUiLanguage(code);
        if (ui) {
          setLanguage(ui);
          langMapped.current = true;
        }
      }
    },
    [profile.language, setLanguage, setProfileField],
  );

  const speakAndWait = useCallback(async () => {
    const mySession = ++sessionId.current;
    setPhase('talking');
    setDraft(isPhoto ? profile.photo : '');
    setDetected(null);
    setShowType(false);
    stopTalking();

    const intro =
      index === 0 ? `${t('talk.hello')}${questionText}` : questionText;

    await talkAsGuide(intro, language, gender);
    if (mySession !== sessionId.current) return;

    if (isPhoto) {
      setPhase('review');
      setShowType(true);
      return;
    }

    setPhase('ready');
    setTimeout(async () => {
      if (mySession !== sessionId.current) return;
      try {
        await speechService.startListening({
          mode: speechMode,
          language,
          fieldId: String(question.id),
        });
        if (mySession !== sessionId.current) return;
        setPhase('listening');
      } catch {
        setPhase('ready');
      }
    }, 400);
  }, [
    index,
    isPhoto,
    language,
    profile.photo,
    question.id,
    questionText,
    speechMode,
    t,
  ]);

  // Keep the latest per-question speak fn in a ref so the focus effect below can
  // re-speak the CURRENT question without re-subscribing on every unrelated
  // render (e.g. a photo change).
  const speakRef = useRef(speakAndWait);
  useEffect(() => {
    speakRef.current = speakAndWait;
  });

  // Own “Start Audio” only while this screen is focused, and re-speak each time
  // the question (index) or language changes. Clearing on blur (owner-safe)
  // stops a later screen from replaying a registration question.
  useFocusEffect(
    useCallback(() => {
      const replay: () => void | Promise<void> = () => speakRef.current();
      setReplay(replay);
      replay();
      return () => {
        sessionId.current += 1;
        releaseReplay(replay);
        if (speechService.isListening) {
          speechService.stopListening().catch(() => undefined);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, language, setReplay, releaseReplay]),
  );

  const pickPhoto = async (fromCamera: boolean) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t('common.error'), t('registration.photoPermission'));
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          quality: 0.55,
          base64: true,
          allowsEditing: true,
          aspect: [3, 4],
        })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.55,
          base64: true,
          allowsEditing: true,
          aspect: [3, 4],
        });

    if (result.canceled || !result.assets?.[0]?.base64) return;
    const asset = result.assets[0];
    const mime = asset.mimeType ?? 'image/jpeg';
    const dataUrl = `data:${mime};base64,${asset.base64}`;
    setDraft(dataUrl);
    setProfileField('photo', dataUrl);
    setPhase('review');
  };

  const startRecord = async () => {
    stopTalking();
    try {
      await speechService.startListening({
        mode: speechMode,
        language,
        fieldId: String(question.id),
      });
      setPhase('listening');
    } catch {
      Alert.alert(t('common.error'), t('registration.micDenied'));
      setShowType(true);
      setPhase('review');
    }
  };

  const stopRecord = async () => {
    setPhase('processing');
    try {
      const result = await speechService.stopListening();
      applyLanguageDetect(result.detectedLanguage);
      let text = result.text.trim();

      if (question.inputType === 'select') {
        const match = options.find((o) => {
          const label = optionLabel(o, t).toLowerCase();
          return (
            o.value === text ||
            label === text.toLowerCase() ||
            text.toLowerCase().includes(label) ||
            label.includes(text.toLowerCase())
          );
        });
        if (match) text = match.value;
      }

      if (question.field === 'phone') {
        text = text.replace(/\D/g, '').slice(-10);
      }

      setDraft(text);
      if (result.detectedLanguage) {
        setDetected(
          DETECTED_LANGUAGE_LABELS[result.detectedLanguage] ??
            result.detectedLanguage,
        );
      }
      setPhase('review');
      if (text) {
        await talkAsGuide(`${t('talk.isCorrect')} ${text}`, language, gender);
      } else {
        await talkAsGuide(t('registration.voiceFailed'), language, gender);
        setShowType(true);
      }
    } catch {
      setPhase('ready');
      setShowType(true);
      Alert.alert(t('common.error'), t('registration.voiceFailed'));
    }
  };

  const confirm = async () => {
    const value = isPhoto ? profile.photo || draft : draft.trim();
    if (!question.required && !String(value)) {
      advance();
      return;
    }
    const err = validateField(question.field, value);
    if (err) {
      Alert.alert(t('common.error'), t(err));
      return;
    }
    setProfileField(question.field, value);
    await talkAsGuide(t('talk.good'), language, gender);
    advance();
  };

  const advance = () => {
    stopTalking();
    if (index >= REGISTRATION_QUESTIONS.length - 1) onFinished();
    else setIndex((i) => i + 1);
  };

  const statusLabel =
    phase === 'talking'
      ? t('talk.guideTalking')
      : phase === 'listening'
        ? t('talk.yourTurn')
        : phase === 'processing'
          ? t('registration.processing')
          : phase === 'review'
            ? t('talk.checkAnswer')
            : t('talk.readyToSpeak');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <Text style={styles.progress}>
          {index + 1}/{REGISTRATION_QUESTIONS.length}
        </Text>
        <LanguageSwitcher compact />
      </View>

      <View style={styles.stage}>
        <Image source={GUIDE_IMG[gender]} style={styles.guide} resizeMode="cover" />
        <View style={styles.stageOverlay}>
          <Text style={styles.aiLabel}>{t('common.aiGuideLabel')}</Text>
          <View
            style={[
              styles.livePill,
              phase === 'listening' && styles.livePillHot,
              phase === 'talking' && styles.livePillTalk,
            ]}
          >
            {(phase === 'talking' ||
              phase === 'listening' ||
              phase === 'processing') && (
              <ActivityIndicator color={colors.white} style={{ marginRight: 8 }} />
            )}
            <Text style={styles.liveText}>{statusLabel}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.question}>{questionText}</Text>
        {!question.required ? (
          <Text style={styles.optional}>{t('common.optional')}</Text>
        ) : null}
        {detected ? (
          <Text style={styles.detected}>
            {t('registration.detectedLanguage', { language: detected })}
          </Text>
        ) : null}

        {isPhoto ? (
          <View style={styles.photoBlock}>
            {profile.photo || draft ? (
              <Image
                source={{ uri: profile.photo || draft }}
                style={styles.thumb}
              />
            ) : null}
            <BigButton
              label={t('registration.takeSelfie')}
              onPress={() => pickPhoto(true)}
            />
            <BigButton
              label={t('registration.uploadPhoto')}
              onPress={() => pickPhoto(false)}
              variant="secondary"
            />
          </View>
        ) : null}

        {question.inputType === 'select' &&
        (phase === 'ready' || phase === 'review' || showType) ? (
          <View style={styles.options}>
            {options.map((opt) => {
              const selected = draft === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    stopTalking();
                    setDraft(opt.value);
                    setPhase('review');
                  }}
                  style={[styles.option, selected && styles.optionOn]}
                >
                  <Text
                    style={[styles.optionText, selected && styles.optionTextOn]}
                  >
                    {optionLabel(opt, t)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {!isPhoto &&
        (phase === 'review' || showType) &&
        question.inputType !== 'select' ? (
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={t('registration.placeholder')}
            placeholderTextColor="#9CA3AF"
            keyboardType={question.inputType === 'phone' ? 'number-pad' : 'default'}
            maxLength={question.inputType === 'phone' ? 10 : 120}
          />
        ) : null}

        {phase === 'review' && draft && !isPhoto && question.inputType !== 'select' ? (
          <Text style={styles.heard}>
            {t('talk.iHeard')}: {draft}
          </Text>
        ) : null}

        {phase === 'talking' || phase === 'processing' ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        ) : null}

        {!isPhoto && phase === 'ready' ? (
          <Pressable style={styles.micHuge} onPress={startRecord}>
            <Ionicons name="mic" size={56} color={colors.white} />
            <Text style={styles.micLabel}>{t('talk.tapToAnswer')}</Text>
          </Pressable>
        ) : null}

        {!isPhoto && phase === 'listening' ? (
          <Pressable style={[styles.micHuge, styles.micHot]} onPress={stopRecord}>
            <Ionicons name="stop" size={56} color={colors.white} />
            <Text style={styles.micLabel}>{t('talk.tapToStop')}</Text>
          </Pressable>
        ) : null}

        {phase === 'review' ? (
          <>
            <BigButton label={t('registration.confirmAnswer')} onPress={confirm} />
            {!isPhoto ? (
              <BigButton
                label={t('registration.recordAgain')}
                onPress={speakAndWait}
                variant="secondary"
              />
            ) : null}
          </>
        ) : null}

        <View style={styles.rowActions}>
          <Pressable onPress={speakAndWait} style={styles.linkBtn}>
            <Ionicons name="volume-high" size={22} color={colors.gold} />
            <Text style={styles.link}>{t('talk.replay')}</Text>
          </Pressable>
          {!isPhoto ? (
            <Pressable
              onPress={() => {
                setShowType(true);
                setPhase('review');
                stopTalking();
              }}
              style={styles.linkBtn}
            >
              <Ionicons name="keypad" size={22} color={colors.gold} />
              <Text style={styles.link}>{t('talk.typeInstead')}</Text>
            </Pressable>
          ) : null}
          {!question.required ? (
            <Pressable onPress={advance} style={styles.linkBtn}>
              <Text style={styles.link}>{t('common.skip')}</Text>
            </Pressable>
          ) : null}
        </View>
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
  progress: { color: colors.gold, fontWeight: '800', fontSize: 18 },
  stage: {
    height: 240,
    marginHorizontal: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.navySecondary,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  guide: { width: '100%', height: '100%' },
  stageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(7,29,59,0.72)',
  },
  aiLabel: {
    color: colors.gold,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 6,
  },
  livePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navySecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  livePillTalk: { backgroundColor: colors.gold },
  livePillHot: { backgroundColor: colors.red },
  liveText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  panel: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: spacing.md,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
  },
  question: {
    ...typography.bodyLarge,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  optional: {
    textAlign: 'center',
    color: colors.warning,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  detected: {
    textAlign: 'center',
    color: colors.success,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  heard: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: '700',
    color: colors.navy,
  },
  center: { alignItems: 'center', paddingVertical: spacing.lg },
  micHuge: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.navy,
    borderWidth: 5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  micHot: { backgroundColor: colors.red, borderColor: colors.white },
  micLabel: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  input: {
    minHeight: 64,
    borderWidth: 2,
    borderColor: colors.navy,
    borderRadius: 14,
    padding: spacing.md,
    fontSize: 20,
    backgroundColor: colors.white,
    color: colors.navy,
    marginBottom: spacing.md,
  },
  options: { gap: 10, marginBottom: spacing.md },
  option: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  optionOn: { backgroundColor: colors.navy, borderColor: colors.gold },
  optionText: { fontSize: 18, fontWeight: '700', color: colors.navy },
  optionTextOn: { color: colors.white },
  photoBlock: { alignItems: 'center', marginBottom: spacing.md },
  thumb: {
    width: 140,
    height: 180,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { color: colors.navySecondary, fontWeight: '700', fontSize: 16 },
});
