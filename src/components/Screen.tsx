import { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/typography';
import { useApp } from '../store/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Props {
  children: ReactNode;
  title?: string;
  scroll?: boolean;
  showLanguage?: boolean;
  showBack?: boolean;
  navyHeader?: boolean;
  style?: ViewStyle;
  footer?: ReactNode;
}

export function Screen({
  children,
  title,
  scroll = true,
  showLanguage = true,
  showBack = false,
  navyHeader = false,
  style,
  footer,
}: Props) {
  const router = useRouter();
  const { t } = useApp();
  const Body = scroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[styles.safe, navyHeader && { backgroundColor: colors.navy }]}
      edges={['top', 'left', 'right']}
    >
      {(title || showLanguage || showBack) && (
        <View style={[styles.header, navyHeader && styles.headerNavy]}>
          <View style={styles.headerLeft}>
            {showBack ? (
              <Pressable
                onPress={() => router.back()}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={t('common.back')}
              >
                <Ionicons
                  name="arrow-back"
                  size={28}
                  color={navyHeader ? colors.white : colors.navy}
                />
              </Pressable>
            ) : (
              <View style={{ width: 28 }} />
            )}
          </View>
          <Text
            style={[styles.title, navyHeader && { color: colors.white }]}
            numberOfLines={2}
          >
            {title ?? ''}
          </Text>
          <View style={styles.headerRight}>
            {showLanguage ? <LanguageSwitcher compact /> : <View style={{ width: 28 }} />}
          </View>
        </View>
      )}
      <Body
        style={[styles.body, style]}
        contentContainerStyle={scroll ? styles.scrollContent : undefined}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </Body>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  headerNavy: {
    backgroundColor: colors.navy,
    borderBottomColor: colors.navySecondary,
  },
  headerLeft: { width: 40 },
  headerRight: { minWidth: 40, alignItems: 'flex-end' },
  title: {
    ...typography.subtitle,
    flex: 1,
    textAlign: 'center',
  },
  body: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
});
