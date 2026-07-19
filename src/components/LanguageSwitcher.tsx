import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGE_OPTIONS } from '../i18n/languages';
import { colors } from '../theme/colors';
import { spacing } from '../theme/typography';
import { useApp } from '../store/AppContext';
import type { LanguageCode } from '../types';

const LABELS: Record<LanguageCode, string> = {
  en: 'EN',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  as: 'অসমীয়া',
  or: 'ଓଡ଼ିଆ',
  kn: 'ಕನ್ನಡ',
};

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useApp();
  const router = useRouter();

  if (compact) {
    return (
      <Pressable
        onPress={() => router.push('/language')}
        accessibilityRole="button"
        accessibilityLabel={t('common.changeLanguage')}
        style={styles.compact}
      >
        <Ionicons name="language" size={22} color={colors.gold} />
        <Text style={styles.compactText}>{LABELS[language]}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      {LANGUAGE_OPTIONS.map(({ code }) => (
        <Pressable
          key={code}
          onPress={() => setLanguage(code)}
          style={[styles.chip, language === code && styles.chipActive]}
        >
          <Text style={[styles.chipText, language === code && styles.chipTextActive]}>
            {LABELS[code]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  compact: { alignItems: 'center', gap: 2 },
  compactText: { fontSize: 11, fontWeight: '700', color: colors.gold },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    borderColor: colors.gold,
    backgroundColor: colors.navy,
  },
  chipText: { fontSize: 15, fontWeight: '700', color: colors.navy },
  chipTextActive: { color: colors.white },
});
