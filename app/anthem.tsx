import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import {
  cacheDirectory,
  copyAsync,
} from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { NewsDesk } from '@/src/components/NewsDesk';
import { BigButton } from '@/src/components/BigButton';
import { useGuideSpeech } from '@/src/hooks/useGuideSpeech';
import { stopTalking } from '@/src/services/tts';
import { useApp } from '@/src/store/AppContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/typography';

type AnthemLang = 'en' | 'te' | 'hi';

const TRACKS: { code: AnthemLang; titleKey: string; source: number }[] = [
  {
    code: 'en',
    titleKey: 'anthem.trackEn',
    source: require('../assets/audio/anthem-en.mp3'),
  },
  {
    code: 'te',
    titleKey: 'anthem.trackTe',
    source: require('../assets/audio/anthem-te.mpeg'),
  },
  {
    code: 'hi',
    titleKey: 'anthem.trackHi',
    source: require('../assets/audio/anthem-en.mp3'),
  },
];

export default function AnthemScreen() {
  const { t } = useApp();
  const { speaking, speakAgain } = useGuideSpeech('anthem.spoken', true);
  const [selected, setSelected] = useState<AnthemLang>('en');
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => undefined);
    };
  }, []);

  const track = TRACKS.find((x) => x.code === selected) ?? TRACKS[0];

  const stopSong = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => undefined);
      await soundRef.current.unloadAsync().catch(() => undefined);
      soundRef.current = null;
    }
    setPlaying(false);
  };

  const playSong = async () => {
    try {
      stopTalking();
      await stopSong();
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(track.source, {
        shouldPlay: true,
      });
      soundRef.current = sound;
      setPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) setPlaying(false);
      });
    } catch {
      Alert.alert(t('common.error'), t('anthem.playFailed'));
    }
  };

  const downloadSong = async () => {
    try {
      const [asset] = await Asset.loadAsync(track.source);
      const from = asset.localUri ?? asset.uri;
      if (!from) throw new Error('missing');
      const dest = `${cacheDirectory}Agile-Recruitment-Anthem-${selected}${
        selected === 'te' ? '.mpeg' : '.mp3'
      }`;
      await copyAsync({ from, to: dest });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dest);
      } else {
        Alert.alert(t('common.success'), t('anthem.saved'));
      }
    } catch {
      Alert.alert(t('common.error'), t('anthem.downloadFailed'));
    }
  };

  return (
    <NewsDesk
      headline={t('anthem.headline')}
      ticker={t('anthem.ticker')}
      speaking={speaking}
      onHear={speakAgain}
    >
      <Text style={styles.lead}>{t('anthem.lead')}</Text>
      <Text style={styles.pick}>{t('anthem.pickLanguage')}</Text>

      {TRACKS.map((tr) => {
        const on = selected === tr.code;
        return (
          <Pressable
            key={tr.code}
            style={[styles.track, on && styles.trackOn]}
            onPress={() => {
              setSelected(tr.code);
              stopSong();
            }}
          >
            <Ionicons
              name={on ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={on ? colors.navy : colors.gold}
            />
            <Text style={[styles.trackText, on && styles.trackTextOn]}>
              {t(tr.titleKey)}
            </Text>
          </Pressable>
        );
      })}

      <BigButton
        label={playing ? t('anthem.stop') : t('anthem.listen')}
        onPress={playing ? stopSong : playSong}
        variant="gold"
      />
      <BigButton
        label={t('anthem.download')}
        onPress={downloadSong}
        variant="secondary"
      />
    </NewsDesk>
  );
}

const styles = StyleSheet.create({
  lead: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  pick: { color: colors.gold, fontWeight: '800', marginBottom: spacing.sm },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(213,166,46,0.4)',
    marginBottom: spacing.sm,
    backgroundColor: colors.navySecondary,
  },
  trackOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  trackText: { color: colors.white, fontWeight: '700', fontSize: 15, flex: 1 },
  trackTextOn: { color: colors.navy },
});
