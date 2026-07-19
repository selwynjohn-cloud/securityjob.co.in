import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigButton } from '@/src/components/BigButton';
import { BrandHeader } from '@/src/components/BrandHeader';
import { LANGUAGE_OPTIONS } from '@/src/i18n/languages';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <BrandHeader showStats={false} compact />

        <Text style={styles.step}>1. {t('language.title')}</Text>
        <View style={styles.langList}>
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
                <Ionicons
                  name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={26}
                  color={selected ? colors.gold : 'rgba(255,255,255,0.35)'}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.volumeCard}>
          <Ionicons name="headset" size={28} color={colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.step}>2. {t('language.audioTitle')}</Text>
            <Text style={styles.volumeText}>{t('language.audioHint')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <BigButton
          label={t('common.continue')}
          onPress={() => router.replace('/home' as Href)}
          variant="gold"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  step: {
    color: colors.gold,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  langList: { gap: 8, marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(213,166,46,0.35)',
    backgroundColor: colors.navySecondary,
  },
  rowSelected: {
    borderColor: colors.gold,
    backgroundColor: '#0a1628',
  },
  label: { color: colors.white, fontSize: 17, fontWeight: '700' },
  labelSelected: { color: colors.gold },
  hint: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 },
  hintSelected: { color: 'rgba(255,255,255,0.85)' },
  volumeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: 'rgba(213,166,46,0.1)',
  },
  volumeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
});
