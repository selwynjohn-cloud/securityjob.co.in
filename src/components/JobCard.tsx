import { StyleSheet, Text, View } from 'react-native';
import type { JobVacancy } from '../types';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/typography';
import { useApp } from '../store/AppContext';
import { BigButton } from './BigButton';

interface Props {
  job: JobVacancy;
  onTellMore: () => void;
  onApply: () => void;
  onSave: () => void;
  onNotInterested: () => void;
}

export function JobCard({ job, onTellMore, onApply, onSave, onNotInterested }: Props) {
  const { t } = useApp();
  const statusLabel =
    job.vacancyStatus === 'closing_soon' ? t('jobs.statusClosing') : t('jobs.statusOpen');

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.position}>{job.position}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.site}>{job.clientSite}</Text>
      <Text style={styles.meta}>{job.fullAddress}</Text>
      <Text style={styles.meta}>
        {t('jobs.takeHomeLabel')}: {job.takeHomeLabel}
      </Text>
      <Text style={styles.meta}>{t('jobs.dutyHours', { hours: job.dutyHours })}</Text>
      <Text style={styles.meta}>{t('jobs.shift', { shift: job.shift })}</Text>
      <Text style={styles.meta}>
        {t('jobs.epfEsic')}: {job.epf && job.esic ? t('common.yes') : t('common.no')} ·{' '}
        {t('jobs.accommodation')}: {job.accommodation ? t('common.yes') : t('common.no')} ·{' '}
        {t('jobs.transport')}: {job.transport ? t('common.yes') : t('common.no')}
      </Text>
      <BigButton label={t('jobs.tellMore')} onPress={onTellMore} variant="secondary" />
      <BigButton label={t('jobs.applyNow')} onPress={onApply} />
      <BigButton label={t('jobs.saveJob')} onPress={onSave} variant="outline" />
      <BigButton label={t('jobs.notInterested')} onPress={onNotInterested} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  position: { ...typography.subtitle, flex: 1 },
  badge: {
    backgroundColor: colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  site: { ...typography.bodyLarge, marginTop: 4, color: colors.navySecondary },
  meta: { ...typography.body, marginTop: 4, color: colors.textMuted },
});
