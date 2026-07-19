import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { getJobByIdAsync } from '@/src/services/jobs';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';
import type { JobVacancy } from '@/src/types';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, saveJob } = useApp();
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
      <Screen title={t('jobDetails.title')} showBack>
        <ActivityIndicator color={colors.navy} />
      </Screen>
    );
  }

  if (!job) {
    return (
      <Screen title={t('jobDetails.title')} showBack>
        <Text style={typography.body}>{t('common.error')}</Text>
      </Screen>
    );
  }

  const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <Screen title={t('jobDetails.title')} showBack>
      <Text style={styles.title}>{job.position}</Text>
      <Row label={t('jobDetails.siteBranch')} value={`${job.clientSite} / ${job.branch}`} />
      <Row label={t('fields.location')} value={job.fullAddress} />
      <View style={styles.map}>
        <Text style={styles.mapText}>{t('jobDetails.mapPlaceholder')}</Text>
      </View>
      <Row label={t('jobs.dutyHours', { hours: '' }).replace(': ', '')} value={job.dutyHours} />
      <Row label={t('jobs.shift', { shift: '' }).replace(': ', '')} value={job.shift} />
      <Row label={t('jobs.takeHomeLabel')} value={job.takeHomeLabel} />
      <Row label={t('jobDetails.overtime')} value={job.overtime} />
      <Row label={t('jobDetails.weeklyOff')} value={job.weeklyOff} />
      <Row label="EPF" value={job.epf ? t('common.yes') : t('common.no')} />
      <Row label="ESIC" value={job.esic ? t('common.yes') : t('common.no')} />
      <Row label={t('jobDetails.bonus')} value={job.bonus} />
      <Row label={t('jobDetails.leave')} value={job.leave} />
      <Row
        label={t('jobs.accommodation')}
        value={job.accommodation ? t('common.yes') : t('common.no')}
      />
      <Row label={t('jobDetails.food')} value={job.food ? t('common.yes') : t('common.no')} />
      <Row
        label={t('jobs.transport')}
        value={job.transport ? t('common.yes') : t('common.no')}
      />
      <Row label={t('jobDetails.age')} value={job.ageRequirement} />
      <Row label={t('jobDetails.experience')} value={job.experienceRequirement} />
      <Row label={t('jobDetails.documents')} value={job.documentsRequired.join(', ')} />
      <Row label={t('jobDetails.interview')} value={job.interviewProcess} />
      <Row label={t('jobDetails.joining')} value={job.joiningDate} />
      <Row
        label={t('jobDetails.recruiter')}
        value={`${job.recruiterName} · ${job.recruiterPhone}`}
      />

      <BigButton label={t('jobs.applyNow')} onPress={() => router.push(`/apply/${job.id}`)} />
      <BigButton
        label={t('jobDetails.hearDetails')}
        onPress={() => Alert.alert(t('jobDetails.hearDetails'), t('jobDetails.hearDemo'))}
        variant="secondary"
      />
      <BigButton
        label={t('common.save')}
        onPress={() => {
          saveJob(job.id);
          Alert.alert(t('common.success'), t('jobs.saved'));
        }}
        variant="outline"
      />
      <BigButton
        label={t('jobDetails.callRecruiter')}
        onPress={() => Linking.openURL(`tel:${job.recruiterPhone}`)}
        variant="outline"
      />
      <BigButton
        label={t('jobDetails.whatsappRecruiter')}
        onPress={() =>
          Linking.openURL(`https://wa.me/91${job.recruiterPhone.replace(/\D/g, '')}`)
        }
        variant="outline"
      />
      <BigButton label={t('common.back')} onPress={() => router.back()} variant="outline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, marginBottom: spacing.md },
  row: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { ...typography.label },
  value: { ...typography.body, marginTop: 2 },
  map: {
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.navySecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  mapText: { color: colors.white, textAlign: 'center', fontWeight: '600' },
});
