import { ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { REGISTRATION_QUESTIONS } from '@/src/data/registrationQuestions';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

const GUIDE = {
  male: require('../assets/images/male-agile-guide.png'),
  female: require('../assets/images/female-agile-guide.png'),
};

export default function RegistrationIntroScreen() {
  const router = useRouter();
  const { t, guide } = useApp();
  const { speaking, speakAgain } = useGuideSpeech('talk.spokenIntro', true);
  const total = REGISTRATION_QUESTIONS.length;
  const g = guide ?? 'male';

  return (
    <Screen title={t('talk.introTitle')} showBack>
      <View style={styles.card}>
        <Image source={GUIDE[g]} style={styles.img} resizeMode="cover" />
        <Text style={styles.ai}>{t('common.aiGuideLabel')}</Text>
      </View>
      {speaking ? (
        <View style={styles.speaking}>
          <ActivityIndicator color={colors.white} />
          <Text style={styles.speakingText}>{t('talk.guideTalking')}</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{t('talk.introTitle')}</Text>
      <Text style={styles.body}>{t('talk.introBody')}</Text>
      <Text style={styles.meta}>
        {t('regIntro.questionsApprox', { count: total })}
      </Text>
      <BigButton
        label={t('talk.startVideo')}
        onPress={() => router.push('/registration')}
      />
      <BigButton label={t('consent.hearAgain')} onPress={speakAgain} variant="outline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.gold,
    backgroundColor: colors.navy,
  },
  img: { width: '100%', height: 240 },
  ai: {
    color: colors.gold,
    fontWeight: '800',
    paddingVertical: 10,
    fontSize: 16,
  },
  speaking: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.navy,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.sm,
  },
  speakingText: { color: colors.gold, fontWeight: '800', fontSize: 16 },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  meta: {
    ...typography.subtitle,
    textAlign: 'center',
    color: colors.red,
    marginBottom: spacing.lg,
  },
});
