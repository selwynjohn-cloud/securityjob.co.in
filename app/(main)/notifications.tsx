import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/src/components/Screen';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing, typography } from '@/src/theme/typography';

export default function NotificationsScreen() {
  const { t, notifications, markNotificationRead } = useApp();

  return (
    <Screen title={t('notifications.title')}>
      {notifications.length === 0 ? (
        <Text style={typography.bodyLarge}>{t('notifications.empty')}</Text>
      ) : (
        notifications.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => markNotificationRead(n.id)}
            style={[styles.card, !n.read && styles.unread]}
          >
            <View style={styles.row}>
              <Text style={styles.title}>{t(n.titleKey)}</Text>
              {!n.read ? <View style={styles.dot} /> : null}
            </View>
            <Text style={styles.body}>{t(n.bodyKey)}</Text>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unread: { borderLeftWidth: 4, borderLeftColor: colors.red },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.subtitle, fontSize: 17, flex: 1 },
  body: { ...typography.body, marginTop: 4, color: colors.textMuted },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.red,
  },
});
