import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { LIBRARY_CATEGORIES, LIBRARY_FAQS } from '@/src/data/sampleLibrary';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useApp();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const search = () => {
    const q = question.trim().toLowerCase();
    if (!q) return;
    const hit = LIBRARY_FAQS.find((f) => {
      const text = t(f.questionKey).toLowerCase() + ' ' + t(f.answerKey).toLowerCase();
      return q.split(/\s+/).some((w) => w.length > 2 && text.includes(w));
    });
    setAnswer(hit ? t(hit.answerKey) : t('library.noMatch'));
  };

  const faqs = activeCategory
    ? LIBRARY_FAQS.filter((f) => f.categoryId === activeCategory)
    : LIBRARY_FAQS;

  return (
    <Screen title={t('library.title')}>
      <Text style={styles.sub}>{t('library.subtitle')}</Text>
      <BigButton
        label={t('library.askVoice')}
        onPress={() => Alert.alert(t('library.askVoice'), t('library.voiceDemo'))}
        variant="secondary"
      />
      <Text style={styles.label}>{t('library.typeQuestion')}</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder={t('library.typePlaceholder')}
        placeholderTextColor={colors.disabled}
        multiline
      />
      <BigButton label={t('common.submit')} onPress={search} />
      {answer ? (
        <View style={styles.answerBox}>
          <Text style={styles.demoTag}>{t('library.demoAnswer')}</Text>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>{t('library.faqs')}</Text>
      <View style={styles.chips}>
        <Pressable
          onPress={() => setActiveCategory(null)}
          style={[styles.chip, !activeCategory && styles.chipOn]}
        >
          <Text style={[styles.chipText, !activeCategory && styles.chipTextOn]}>All</Text>
        </Pressable>
        {LIBRARY_CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setActiveCategory(c.id)}
            style={[styles.chip, activeCategory === c.id && styles.chipOn]}
          >
            <Text
              style={[styles.chipText, activeCategory === c.id && styles.chipTextOn]}
            >
              {t(c.titleKey)}
            </Text>
          </Pressable>
        ))}
      </View>

      {faqs.map((f) => (
        <Pressable
          key={f.id}
          style={styles.faq}
          onPress={() => setAnswer(t(f.answerKey))}
        >
          <Text style={styles.faqQ}>{t(f.questionKey)}</Text>
        </Pressable>
      ))}

      <BigButton
        label={t('library.humanSupport')}
        onPress={() => router.push('/support')}
        variant="outline"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { ...typography.caption, marginBottom: spacing.md },
  label: { ...typography.label, marginTop: spacing.md },
  input: {
    minHeight: 80,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 17,
    backgroundColor: colors.white,
    marginVertical: spacing.sm,
    color: colors.navy,
  },
  answerBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    marginBottom: spacing.md,
  },
  demoTag: { ...typography.caption, color: colors.warning, fontWeight: '700' },
  answer: { ...typography.body, marginTop: spacing.xs },
  section: { ...typography.subtitle, marginTop: spacing.md, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.gold },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.navy },
  chipTextOn: { color: colors.white },
  faq: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqQ: { ...typography.body, fontWeight: '600' },
});
