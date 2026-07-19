import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { GuidePortrait } from '@/src/components/GuidePortrait';
import { useApp } from '@/src/store/AppContext';
import { spacing, typography } from '@/src/theme/typography';

export default function LearnScreen() {
  const router = useRouter();
  const { t } = useApp();

  return (
    <Screen title={t('learn.title')} showBack>
      <GuidePortrait size="md" />
      <Text style={styles.body}>{t('learn.body')}</Text>
      <BigButton label={t('learn.cta')} onPress={() => router.push('/consent')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
});
