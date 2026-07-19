import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'gold';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}

const bg: Record<Variant, string> = {
  primary: colors.red,
  secondary: colors.navySecondary,
  outline: colors.white,
  danger: colors.error,
  gold: colors.gold,
};

export function BigButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) {
  const isOutline = variant === 'outline';
  const isGold = variant === 'gold';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg[variant],
          opacity: disabled ? 0.4 : pressed ? 0.9 : 1,
          borderWidth: isOutline ? 3 : 0,
          borderColor: colors.navy,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="large" color={isOutline || isGold ? colors.navy : colors.white} />
      ) : (
        <Text
          style={[
            typography.button,
            {
              color: isOutline || isGold ? colors.navy : colors.white,
              textAlign: 'center',
            },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 64,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
});
