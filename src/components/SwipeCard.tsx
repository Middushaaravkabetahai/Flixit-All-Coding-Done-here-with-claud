import { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Deal } from '../data/mockDeals';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type Props = {
  deal: Deal;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
};

export function SwipeCard({ deal, onSwipe, isTop }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          const direction = gesture.dx > 0 ? 'right' : 'left';
          Animated.timing(pan, {
            toValue: { x: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH, y: gesture.dy },
            duration: 200,
            useNativeDriver: false,
          }).start(() => onSwipe(direction));
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [10, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.card,
        isTop && {
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
        },
      ]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <Image source={{ uri: deal.imageUrl }} style={styles.image} />

      {isTop && (
        <>
          <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
            <Text style={styles.badgeText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity }]}>
            <Text style={styles.badgeText}>NOPE</Text>
          </Animated.View>
        </>
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{deal.title}</Text>
        <Text style={styles.category}>{deal.category}</Text>
        <Text style={styles.price}>
          From ${Math.min(...deal.retailers.map((r) => r.price)).toFixed(2)}
        </Text>
      </View>
    </Animated.View>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 48;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    aspectRatio: 3 / 4,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  image: { width: '100%', height: '78%', backgroundColor: '#eee' },
  info: { padding: 16, gap: 2 },
  title: { fontSize: 18, fontWeight: '700' },
  category: { color: '#666' },
  price: { fontWeight: '600', marginTop: 4 },
  badge: {
    position: 'absolute',
    top: 24,
    borderWidth: 3,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  likeBadge: { left: 20, borderColor: '#2ecc71', transform: [{ rotate: '-15deg' }] },
  nopeBadge: { right: 20, borderColor: '#e74c3c', transform: [{ rotate: '15deg' }] },
  badgeText: { fontSize: 22, fontWeight: '800', color: '#111' },
});
