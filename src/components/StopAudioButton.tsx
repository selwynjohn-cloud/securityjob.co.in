import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';
import { useSpeechPlayback } from '../store/SpeechPlayback';
import { colors } from '../theme/colors';

/**
 * On every screen:
 * - While speaking → Stop audio
 * - When silent → Start audio again (replay this page’s guide)
 */
export function StopAudioButton() {
  const { t } = useApp();
  const insets = useSafeAreaInsets();
  const { speaking, canReplay, stop, startAgain } = useSpeechPlayback();

  // Nothing is playing and this page has no guide script to (re)play → no button,
  // so Start Audio can never speak the previous page or empty silence.
  if (!speaking && !canReplay) return null;

  return (
    <View
      style={[styles.row, { bottom: Math.max(insets.bottom, 12) + 64 }]}
      pointerEvents="box-none"
    >
      {speaking ? (
        <Pressable
          onPress={stop}
          style={[styles.fab, styles.fabStop]}
          accessibilityRole="button"
          accessibilityLabel={t('common.stopAudio')}
        >
          <Ionicons name="stop-circle" size={22} color={colors.white} />
          <Text style={styles.labelStop}>{t('common.stopAudio')}</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            // Click unlocks web audio so OpenAI MP3 can play after fetch.
            startAgain();
          }}
          style={[styles.fab, styles.fabStart]}
          accessibilityRole="button"
          accessibilityLabel={t('common.startAudio')}
        >
          <Ionicons name="play-circle" size={22} color={colors.navy} />
          <Text style={styles.labelStart}>{t('common.startAudio')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    right: 14,
    zIndex: 999,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  fabStop: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  fabStart: {
    backgroundColor: colors.gold,
    borderColor: 'rgba(7,29,59,0.25)',
  },
  labelStop: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 13,
  },
  labelStart: {
    color: colors.navy,
    fontWeight: '900',
    fontSize: 13,
  },
});
