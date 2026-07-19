import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { useApp } from '@/src/store/AppContext';
import { typography } from '@/src/theme/typography';
import { Text } from 'react-native';

/** OTP skipped — SMS verification disabled for now. */
export default function OtpScreen() {
  const router = useRouter();
  const { t } = useApp();

  useEffect(() => {
    router.replace('/confirmation');
  }, [router]);

  return (
    <Screen title={t('otp.title')}>
      <Text style={typography.body}>{t('common.loading')}</Text>
    </Screen>
  );
}
