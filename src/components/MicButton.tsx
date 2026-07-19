import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/typography';
import { useApp } from '../store/AppContext';

interface Props {
  listening: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function MicButton({ listening, onPress, disabled }: Props) {
  const { t } = useApp();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!listening) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [listening, pulse]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            listening ? t('registration.stop') : t('registration.tapAndSpeak')
          }
          onPress={onPress}
          disabled={disabled}
          style={[
            styles.btn,
            {
              backgroundColor: listening ? colors.micListening : colors.navy,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Ionicons
            name={listening ? 'stop' : 'mic'}
            size={52}
            color={colors.white}
          />
        </Pressable>
      </Animated.View>
      <Text style={styles.caption}>
        {listening ? t('registration.listening') : t('registration.tapAndSpeak')}
      </Text>
      {listening ? (
        <Text style={styles.hint}>{t('registration.stopHint')}</Text>
      ) : (
        <Text style={styles.hint}>{t('registration.speakHint')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginVertical: spacing.lg },
  btn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: colors.gold,
  },
  caption: {
    ...typography.bodyLarge,
    marginTop: spacing.md,
    fontWeight: '800',
    color: colors.navy,
    textAlign: 'center',
  },
  hint: {
    ...typography.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
