import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { getJobById } from '@/src/services/jobs';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';
import type { ApplicationStatus } from '@/src/types';

const FLOW: ApplicationStatus[] = [
  'submitted',
  'recruiter_assigned',
  'contacted',
  'interview_scheduled',
  'selected',
  'ready_to_join',
  'joined',
];

const TERMINAL: ApplicationStatus[] = ['rejected', 'not_interested', 'vacancy_closed'];

export default function StatusScreen() {
  const router = useRouter();
  const { t, application, setApplicationStatus } = useApp();
  const job = application ? getJobById(application.jobId) : undefined;

  if (!application) {
    return (
      <Screen title={t('status.title')}>
        <Text style={styles.empty}>{t('status.noApplication')}</Text>
        <BigButton label={t('success.viewJobs')} onPress={() => router.push('/(main)/jobs')} />
      </Screen>
    );
  }

  const isTerminal = TERMINAL.includes(application.status);
  const currentIndex = FLOW.indexOf(application.status);

  return (
    <Screen title={t('status.title')}>
      {job ? (
        <Text style={styles.job}>
          {job.position} — {job.clientSite}
        </Text>
      ) : null}

      {isTerminal ? (
        <View style={styles.terminal}>
          <Ionicons name="close-circle" size={40} color={colors.error} />
          <Text style={styles.terminalText}>
            {t(`status.terminal.${application.status}`)}
          </Text>
        </View>
      ) : (
        FLOW.map((step, i) => {
          const done = i <= currentIndex;
          return (
            <View key={step} style={styles.step}>
              <View style={[styles.dot, done && styles.dotDone]}>
                <Ionicons
                  name={done ? 'checkmark' : 'ellipse-outline'}
                  size={18}
                  color={colors.white}
                />
              </View>
              <Text style={[styles.stepLabel, done && styles.stepDone]}>
                {t(`status.steps.${step}`)}
              </Text>
            </View>
          );
        })
      )}

      {/* Demo controls to preview tracker */}
      <Text style={styles.demo}>{t('common.demoData')}</Text>
      <BigButton
        label={t('status.steps.recruiter_assigned')}
        variant="outline"
        onPress={() => setApplicationStatus('recruiter_assigned')}
      />
      <BigButton
        label={t('status.steps.interview_scheduled')}
        variant="outline"
        onPress={() => setApplicationStatus('interview_scheduled')}
      />
      <BigButton
        label={t('status.steps.selected')}
        variant="secondary"
        onPress={() => setApplicationStatus('selected')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { ...typography.bodyLarge, marginBottom: spacing.lg },
  job: { ...typography.subtitle, marginBottom: spacing.lg },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.success },
  stepLabel: { ...typography.body, color: colors.textMuted, flex: 1 },
  stepDone: { color: colors.navy, fontWeight: '700' },
  terminal: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: spacing.lg,
  },
  terminalText: { ...typography.subtitle, color: colors.error, marginTop: spacing.sm },
  demo: { ...typography.caption, marginTop: spacing.lg, marginBottom: spacing.sm },
});
