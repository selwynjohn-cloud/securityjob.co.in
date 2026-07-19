import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { GuidePortrait } from '@/src/components/GuidePortrait';
import { formatFieldValue } from '@/src/components/RegistrationQuestion';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';
import type { CandidateProfile } from '@/src/types';

const FIELDS: (keyof CandidateProfile)[] = [
  'name',
  'phone',
  'location',
  'role',
  'experience',
  'education',
  'language',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { t, profile, registered, resetDemo } = useApp();

  return (
    <Screen title={t('profile.title')}>
      <GuidePortrait size="sm" />
      {profile.photo ? (
        <Image source={{ uri: profile.photo }} style={styles.photo} />
      ) : null}
      <Text style={styles.reg}>
        {t('success.regNumber')}: {profile.registrationNumber ?? '—'}
      </Text>
      {FIELDS.map((field) => (
        <View key={field} style={styles.row}>
          <Text style={styles.label}>{t(`fields.${field}`)}</Text>
          <Text style={styles.value}>{formatFieldValue(field, profile, t)}</Text>
        </View>
      ))}
      <Text style={styles.section}>{t('profile.consentStatus')}</Text>
      <Text style={styles.value}>
        {profile.consents.privacy ? `✓ ${t('profile.privacyOk')}` : '—'}
      </Text>
      <Text style={styles.value}>
        {profile.consents.contact ? `✓ ${t('profile.contactOk')}` : '—'}
      </Text>
      <Text style={styles.value}>
        {profile.consents.whatsapp ? `✓ ${t('profile.whatsappOk')}` : '—'}
      </Text>
      <Text style={styles.hint}>{t('profile.updateHint')}</Text>
      <BigButton
        label={t('welcome.contactSupport')}
        onPress={() => router.push('/support')}
        variant="secondary"
      />
      {!registered ? (
        <BigButton
          label={t('welcome.startRegistration')}
          onPress={() => router.push('/splash')}
        />
      ) : null}
      <BigButton
        label="Reset demo data"
        onPress={resetDemo}
        variant="outline"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 96,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: spacing.sm,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  reg: {
    ...typography.subtitle,
    textAlign: 'center',
    color: colors.red,
    marginVertical: spacing.md,
  },
  row: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { ...typography.label },
  value: { ...typography.body, marginTop: 2 },
  section: { ...typography.subtitle, marginTop: spacing.md, marginBottom: spacing.sm },
  hint: { ...typography.caption, marginVertical: spacing.md, color: colors.textMuted },
});
