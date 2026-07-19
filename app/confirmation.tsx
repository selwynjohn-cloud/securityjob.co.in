import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { formatFieldValue } from '@/src/components/RegistrationQuestion';
import { REGISTRATION_QUESTIONS } from '@/src/data/registrationQuestions';
import { submitRegistration } from '@/src/services/registration';
import { getMissingRequiredFields } from '@/src/services/validation';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { t, profile, completeRegistration } = useApp();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const missing = getMissingRequiredFields(profile);

  return (
    <Screen title={t('confirmation.title')} showBack>
      <Text style={styles.sub}>{t('confirmation.subtitle')}</Text>
      {REGISTRATION_QUESTIONS.map((q) => {
        const value = formatFieldValue(q.field, profile, t);
        const ok = !missing.includes(q.field) && value !== '—';
        return (
          <View key={String(q.id)} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t(`fields.${String(q.field)}`)}</Text>
              <Text style={styles.value}>{value}</Text>
              <View style={styles.indicator}>
                <Ionicons
                  name={ok ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={ok ? colors.success : colors.warning}
                />
                <Text style={{ color: ok ? colors.success : colors.warning, marginLeft: 4 }}>
                  {ok ? t('confirmation.confirmed') : t('common.required')}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push('/registration')}
              style={styles.editBtn}
            >
              <Text style={styles.editText}>{t('common.edit')}</Text>
            </Pressable>
          </View>
        );
      })}
      {error ? <Text style={styles.error}>{t('confirmation.incomplete')}</Text> : null}
      <BigButton
        label={t('confirmation.submit')}
        loading={loading}
        onPress={async () => {
          if (missing.length) {
            setError(true);
            return;
          }
          setLoading(true);
          try {
            const saved = await submitRegistration(profile);
            completeRegistration(saved);
            router.replace('/success');
          } catch (e) {
            Alert.alert(
              t('common.error'),
              e instanceof Error ? e.message : t('registration.submitFailed'),
            );
          } finally {
            setLoading(false);
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { ...typography.body, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    alignItems: 'center',
  },
  label: { ...typography.label },
  value: { ...typography.bodyLarge, marginTop: 2 },
  indicator: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.navySecondary,
  },
  editText: { color: colors.white, fontWeight: '700' },
  error: { color: colors.error, fontWeight: '700', marginVertical: spacing.sm },
});
