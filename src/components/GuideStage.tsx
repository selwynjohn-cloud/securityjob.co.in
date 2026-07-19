import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getGuide } from '../data/guides';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

const GUIDE_IMG = {
  male: require('../../assets/images/male-agile-guide.png'),
  female: require('../../assets/images/female-agile-guide.png'),
};

/** Standard passport proportion 35×45 mm → 7:9 */
export const PASSPORT_RATIO = 9 / 7;

/** Recommended on-screen passport size (dp) — large enough to see full face & head */
export function passportSize(maxWidth = 220): { width: number; height: number } {
  const width = Math.min(maxWidth, 260);
  const height = Math.round(width * PASSPORT_RATIO);
  return { width, height };
}

interface Props {
  width?: number;
  height?: number;
  speaking?: boolean;
  onPress?: () => void;
  showStamp?: string;
}

/**
 * Passport-size guide photo — head & shoulders, formal ID look.
 */
export function GuideStage({
  width: widthProp,
  height: heightProp,
  speaking,
  onPress,
  showStamp,
}: Props) {
  const { guide } = useApp();
  const active = getGuide(guide);
  const defaults = passportSize();
  const width = widthProp ?? defaults.width;
  const height = heightProp ?? defaults.height;

  return (
    <Pressable
      style={styles.wrap}
      onPressIn={onPress}
      disabled={!onPress}
      accessibilityLabel={active.name}
    >
      <View style={[styles.passport, { width, height }]}>
        <View style={styles.photoClip}>
          <Image
            source={GUIDE_IMG[active.gender]}
            style={styles.photo}
            resizeMode="contain"
          />
        </View>
        {onPress ? (
          <View style={styles.hearHint}>
            <Ionicons
              name={speaking ? 'radio' : 'volume-high'}
              size={12}
              color={colors.navy}
            />
          </View>
        ) : null}
      </View>

      <Text style={styles.name}>{active.name}</Text>
      <Text style={styles.idNo}>Id.No. {active.idNo}</Text>
      {showStamp ? <Text style={styles.stamp}>{showStamp}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  /** White matte + thin border like a passport / ID photo */
  passport: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 2,
    overflow: 'hidden',
    // subtle “photo print” edge
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  photoClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: 4,
    backgroundColor: '#E8E8E8',
  },
  /** Full head & face visible (passport-style) */
  photo: {
    width: '100%',
    height: '100%',
  },
  hearHint: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 10,
    color: colors.white,
    fontWeight: '900',
    fontSize: 15,
    textAlign: 'center',
  },
  idNo: {
    marginTop: 2,
    color: colors.gold,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  stamp: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 10,
    textAlign: 'center',
  },
});
