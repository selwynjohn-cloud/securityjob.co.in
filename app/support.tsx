import { Alert, Linking, StyleSheet } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { GuidePortrait } from '@/src/components/GuidePortrait';
import { useApp } from '@/src/store/AppContext';
import { spacing } from '@/src/theme/typography';

export default function SupportScreen() {
  const { t } = useApp();
  const phone = t('support.phone');

  const demo = (label: string) =>
    Alert.alert(label, t('support.submitted'));

  return (
    <Screen title={t('support.title')} showBack>
      <GuidePortrait size="sm" />
      <BigButton
        label={t('support.requestCall')}
        onPress={() => demo(t('support.requestCall'))}
        style={{ marginTop: spacing.md }}
      />
      <BigButton
        label={t('support.callRecruitment')}
        onPress={() => Linking.openURL(`tel:${phone}`)}
        variant="secondary"
      />
      <BigButton
        label={t('support.whatsappRecruitment')}
        onPress={() => Linking.openURL(`https://wa.me/91${phone}`)}
        variant="secondary"
      />
      <BigButton
        label={t('support.complaint')}
        onPress={() => demo(t('support.complaint'))}
        variant="outline"
      />
      <BigButton
        label={t('support.suggestion')}
        onPress={() => demo(t('support.suggestion'))}
        variant="outline"
      />
      <BigButton
        label={t('support.technical')}
        onPress={() => demo(t('support.technical'))}
        variant="outline"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
