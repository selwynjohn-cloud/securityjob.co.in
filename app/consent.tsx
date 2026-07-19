import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { GuidePortrait } from '@/src/components/GuidePortrait';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { useApp } from '@/src/store/AppContext';
import { hasMandatoryConsents } from '@/src/services/validation';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

export default function ConsentScreen() {
  const router = useRouter();
  const { t, profile, setConsents } = useApp();
  const { speaking, speakAgain } = useGuideSpeech('consent.spoken');
  const [error, setError] = useState(false);
  const c = profile.consents;

  const toggle = (key: 'privacy' | 'contact' | 'whatsapp') => {
    setError(false);
    setConsents({ ...c, [key]: !c[key] });
  };

  const Check = ({
    checked,
    label,
    onPress,
  }: {
    checked: boolean;
    label: string;
    onPress: () => void;
  }) => (
    <Pressable onPress={onPress} style={styles.checkRow}>
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={34}
        color={checked ? colors.success : colors.navy}
      />
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );

  return (
    <Screen title={t('consent.title')} showBack>
      <GuidePortrait size="sm" />
      {speaking ? (
        <View style={styles.speaking}>
          <ActivityIndicator color={colors.white} />
          <Text style={styles.speakingText}>{t('talk.guideTalking')}</Text>
        </View>
      ) : null}
      <Text style={styles.intro}>{t('consent.intro')}</Text>
      {(['point1', 'point2', 'point3', 'point4', 'point5'] as const).map((p) => (
        <Text key={p} style={styles.point}>
          • {t(`consent.${p}`)}
        </Text>
      ))}
      <View style={styles.box}>
        <Check checked={c.privacy} label={t('consent.privacy')} onPress={() => toggle('privacy')} />
        <Check checked={c.contact} label={t('consent.contact')} onPress={() => toggle('contact')} />
        <Check checked={c.whatsapp} label={t('consent.whatsapp')} onPress={() => toggle('whatsapp')} />
      </View>
      {error ? <Text style={styles.error}>{t('consent.mustConsent')}</Text> : null}
      <BigButton
        label={t('consent.continueDetails')}
        onPress={() => {
          if (!hasMandatoryConsents(c)) {
            setError(true);
            return;
          }
          router.push('/registration-intro');
        }}
      />
      <BigButton label={t('consent.hearAgain')} onPress={speakAgain} variant="outline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  intro: { ...typography.bodyLarge, marginBottom: spacing.md, fontWeight: '700' },
  point: { ...typography.body, marginBottom: spacing.sm },
  box: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  checkLabel: { ...typography.body, flex: 1, fontWeight: '600' },
  error: { color: colors.error, fontWeight: '700', marginBottom: spacing.sm },
});
