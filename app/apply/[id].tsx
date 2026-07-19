import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { getJobByIdAsync } from '@/src/services/jobs';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';
import type { JobVacancy } from '@/src/types';

export default function ApplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, profile, submitApplication, registered } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [job, setJob] = useState<JobVacancy | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobByIdAsync(String(id)).then((j) => {
      setJob(j);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Screen title={t('apply.title')} showBack>
        <ActivityIndicator color={colors.navy} />
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen title={t('apply.title')} showBack>
        <Text>{t('common.error')}</Text>
      </Screen>
    );
  }

  return (
    <Screen title={t('apply.title')} showBack>
      <Text style={styles.section}>{t('apply.jobDetails')}</Text>
      <View style={styles.box}>
        <Text style={styles.line}>{job.position}</Text>
        <Text style={styles.meta}>{job.clientSite}</Text>
        <Text style={styles.meta}>{job.location}</Text>
        <Text style={styles.meta}>{job.takeHomeLabel}</Text>
      </View>

      <Text style={styles.section}>{t('apply.candidateDetails')}</Text>
      <View style={styles.box}>
        <Text style={styles.line}>{profile.name || '—'}</Text>
        <Text style={styles.meta}>{profile.phone || '—'}</Text>
        <Text style={styles.meta}>{profile.registrationNumber || '—'}</Text>
      </View>

      <Pressable onPress={() => setConfirmed((v) => !v)} style={styles.check}>
        <Ionicons
          name={confirmed ? 'checkbox' : 'square-outline'}
          size={30}
          color={confirmed ? colors.success : colors.navy}
        />
        <Text style={styles.checkLabel}>{t('apply.checkbox')}</Text>
      </Pressable>

      <BigButton
        label={t('apply.submit')}
        onPress={() => {
          if (!registered) {
            Alert.alert(t('common.error'), t('welcome.startRegistration'));
            router.push('/consent');
            return;
          }
          if (!confirmed) {
            Alert.alert(t('common.error'), t('apply.mustConfirm'));
            return;
          }
          submitApplication(job.id);
          Alert.alert(t('common.success'), t('apply.success'), [
            { text: t('common.continue'), onPress: () => router.replace('/(main)/status') },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.subtitle, marginBottom: spacing.sm, marginTop: spacing.sm },
  box: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  line: { ...typography.bodyLarge, fontWeight: '700' },
  meta: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  check: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  checkLabel: { ...typography.body, flex: 1 },
});
