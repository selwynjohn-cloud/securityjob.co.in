import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { LANGUAGE_OPTIONS } from '@/src/i18n/languages';
import { isCloudSpeechConfigured } from '@/src/services/speech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';
import type { SpeechMode } from '@/src/types';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, language, setLanguage, speechMode, setSpeechMode, guide, setGuide } =
    useApp();
  const cloudReady = isCloudSpeechConfigured();

  const ModeRow = ({ mode, titleKey, hintKey }: { mode: SpeechMode; titleKey: string; hintKey: string }) => {
    const selected = speechMode === mode;
    return (
      <Pressable
        onPress={() => setSpeechMode(mode)}
        style={[styles.modeRow, selected && styles.rowSelected]}
      >
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={selected ? colors.gold : colors.navySecondary}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, selected && styles.labelSelected]}>{t(titleKey)}</Text>
          <Text style={[styles.hint, selected && styles.hintSelected]}>{t(hintKey)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen title={t('language.title')} showLanguage={false} showBack>
      {LANGUAGE_OPTIONS.map((lang) => {
        const selected = language === lang.code;
        return (
          <Pressable
            key={lang.code}
            onPress={() => setLanguage(lang.code)}
            style={[styles.row, selected && styles.rowSelected]}
          >
            <View>
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {lang.nativeLabel}
              </Text>
              <Text style={[styles.hint, selected && styles.hintSelected]}>
                {lang.englishName}
              </Text>
            </View>
            <Pressable
              onPress={() => Alert.alert(t('language.hearSample'), lang.nativeLabel)}
              hitSlop={10}
              accessibilityLabel={t('language.hearSample')}
            >
              <Ionicons
                name="volume-high"
                size={28}
                color={selected ? colors.gold : colors.navySecondary}
              />
            </Pressable>
          </Pressable>
        );
      })}

      <Text style={styles.section}>{t('language.speechModeTitle')}</Text>
      <ModeRow
        mode="auto"
        titleKey="language.speechAuto"
        hintKey="language.speechAutoHint"
      />
      <ModeRow
        mode="manual"
        titleKey="language.speechManual"
        hintKey="language.speechManualHint"
      />

      {!cloudReady ? (
        <Text style={styles.apiNote}>{t('language.needsApiKey')}</Text>
      ) : null}

      <View style={{ height: spacing.lg }} />
      <BigButton
        label={t('common.continue')}
        onPress={() => {
          setGuide('female');
          router.replace('/home' as Href);
        }}
        variant="gold"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    minHeight: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  rowSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.navy,
  },
  label: { ...typography.bodyLarge, fontWeight: '700' },
  labelSelected: { color: colors.white },
  hint: { ...typography.caption, marginTop: 2 },
  hintSelected: { color: '#E5E7EB' },
  section: {
    ...typography.subtitle,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  apiNote: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
});
