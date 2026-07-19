import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { GuideGender } from '../types';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/typography';
import { useApp } from '../store/AppContext';

const IMAGES = {
  male: require('../../assets/images/male-agile-guide.png'),
  female: require('../../assets/images/female-agile-guide.png'),
};

interface Props {
  gender?: GuideGender | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: ViewStyle;
}

const sizes = { sm: 88, md: 140, lg: 200 };

export function GuidePortrait({
  gender,
  size = 'md',
  showLabel = true,
  style,
}: Props) {
  const { guide, t } = useApp();
  const g = gender ?? guide ?? 'male';
  const dim = sizes[size];

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={IMAGES[g]}
        style={{ width: dim, height: dim * 1.25, borderRadius: 16 }}
        resizeMode="cover"
        accessibilityLabel={t('common.aiGuideLabel')}
      />
      {showLabel ? (
        <Text style={styles.label}>{t('common.aiGuideLabel')}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  label: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.navySecondary,
    fontWeight: '700',
  },
});
