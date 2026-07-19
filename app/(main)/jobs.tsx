import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { JobCard } from '@/src/components/JobCard';
import { loadJobs } from '@/src/services/jobs';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import type { JobVacancy } from '@/src/types';

export default function JobsScreen() {
  const router = useRouter();
  const { t, rejectedJobIds, saveJob, rejectJob } = useApp();
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await loadJobs();
    setJobs(list.filter((j) => !rejectedJobIds.includes(j.id)).slice(0, 3));
    setLoading(false);
  }, [rejectedJobIds]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen title={t('jobs.title')}>
      <Text style={{ ...typography.body, marginBottom: 12 }}>{t('jobs.subtitle')}</Text>
      <Text style={{ ...typography.caption, marginBottom: 12, color: colors.navySecondary, fontWeight: '700' }}>
        {t('future.note')}
      </Text>
      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator color={colors.navy} size="large" />
        </View>
      ) : jobs.length === 0 ? (
        <Text style={typography.bodyLarge}>{t('jobs.empty')}</Text>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onTellMore={() => router.push(`/job/${job.id}`)}
            onApply={() => router.push(`/apply/${job.id}`)}
            onSave={() => {
              saveJob(job.id);
              Alert.alert(t('common.success'), t('jobs.saved'));
            }}
            onNotInterested={() => {
              rejectJob(job.id);
              Alert.alert(t('common.done'), t('jobs.rejected'));
            }}
          />
        ))
      )}
      <BigButton
        label={t('studio.chRegister')}
        onPress={() => router.push('/consent')}
        variant="gold"
      />
    </Screen>
  );
}
