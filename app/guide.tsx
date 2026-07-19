import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { BigButton } from '@/src/components/BigButton';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';
import type { GuideGender } from '@/src/types';

const IMAGES = {
  male: require('../assets/images/male-agile-guide.png'),
  female: require('../assets/images/female-agile-guide.png'),
};

export default function GuideScreen() {
  const router = useRouter();
  const { t, guide, setGuide } = useApp();

  const Card = ({ gender, titleKey }: { gender: GuideGender; titleKey: string }) => {
    const selected = guide === gender;
    return (
      <Pressable
        onPress={() => setGuide(gender)}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <Image source={IMAGES[gender]} style={styles.image} resizeMode="cover" />
        <Text style={[styles.name, selected && styles.nameSelected]}>{t(titleKey)}</Text>
        <Text style={[styles.label, selected && styles.nameSelected]}>
          {t('common.aiGuideLabel')}
        </Text>
      </Pressable>
    );
  };

  return (
    <Screen title={t('guide.title')} showBack>
      <Text style={styles.hint}>{t('guide.hint')}</Text>
      <View style={styles.row}>
        <Card gender="male" titleKey="guide.male" />
        <Card gender="female" titleKey="guide.female" />
      </View>
      <BigButton
        label={t('common.continue')}
        onPress={() => router.push('/welcome')}
        disabled={!guide}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { ...typography.body, marginBottom: spacing.md, textAlign: 'center' },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.navy,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  name: {
    ...typography.label,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  label: {
    ...typography.caption,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '700',
  },
  nameSelected: { color: colors.white },
});
