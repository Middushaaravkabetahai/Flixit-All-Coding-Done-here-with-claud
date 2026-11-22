import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { CoverTracklist, OutfitCover } from '../../src/components/OutfitCover';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  buildOutfitDeck,
  dailySeed,
  hasEnoughForOutfit,
  outfitItems,
  type Outfit,
} from '../../src/lib/outfitPlanner';
import {
  getWardrobeImageUrl,
  listWardrobeItems,
  type WardrobeItem,
} from '../../src/lib/wardrobe';

const DECK_SIZE = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 24;
const CARD_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const SNAP = CARD_WIDTH + 16;

/**
 * The first thing you see when you open Flixit.
 *
 * Outfits as album covers you flick sideways through, rather than a list. The
 * covers are seeded on the day, so they are the same set every time the app is
 * opened until tomorrow — "today's options", not a reshuffle on every glance.
 */
export default function Home() {
  const { session, profile } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [deck, setDeck] = useState<Outfit[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // What the closet looked like when this deck was built. Coming back to the
  // tab should not deal a new set of covers.
  const builtFrom = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    setError(null);
    try {
      const data = await listWardrobeItems(session.user.id);
      setItems(data);

      const seed = dailySeed(session.user.id);
      const signature = `${seed}:${data.map((i) => i.id).sort().join(',')}`;
      if (builtFrom.current === signature) return;
      builtFrom.current = signature;

      const nextDeck = buildOutfitDeck(data, DECK_SIZE, seed);
      setDeck(nextDeck);

      // One signed URL per item, not per appearance: the same shirt shows up
      // on several covers and re-signing it each time is wasted round trips.
      const needed = new Map<string, string>();
      for (const outfit of nextDeck) {
        for (const item of outfitItems(outfit)) needed.set(item.id, item.image_path);
      }
      const urls = await Promise.all(
        [...needed].map(async ([id, path]) => [id, await getWardrobeImageUrl(path)] as const)
      );
      setImageUrls(Object.fromEntries(urls));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load your closet');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SNAP);
    if (next !== index) setIndex(next);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centre]}>
        <ActivityIndicator />
      </View>
    );
  }

  const firstName = profile?.display_name?.trim().split(/\s+/)[0];

  if (!hasEnoughForOutfit(items)) {
    return (
      <View style={styles.container}>
        <Header name={firstName} count={items.length} />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your covers show up here.</Text>
          <Text style={styles.emptyBody}>
            Add at least a top and a bottom to your closet and Flixit starts
            building outfits from them every morning.
          </Text>
          <Pressable style={styles.cta} onPress={() => router.push('/wardrobe')}>
            <Text style={styles.ctaText}>Go to my closet</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name={firstName} count={items.length} />

      {Boolean(error) && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={deck}
        keyExtractor={(_, i) => String(i)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={styles.deck}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={[styles.rail, webSnap.rail]}
        renderItem={({ item: outfit }) => (
          <Pressable
            style={[styles.slide, webSnap.slide]}
            onPress={() => router.push('/planner')}
          >
            <OutfitCover outfit={outfit} imageUrls={imageUrls} />
          </Pressable>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {deck.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
        <Text style={styles.counter}>
          {Math.min(index + 1, deck.length)} / {deck.length}
        </Text>
      </View>

      {/* Only the card you are looking at gets a tracklist. Putting one under
          every cover inside the rail meant the next card's numbers bled into
          the gap, which read as a rendering fault rather than a peek. */}
      {Boolean(deck[index]) && (
        <View style={styles.tracksWrap}>
          <CoverTracklist outfit={deck[index]} />

          <View style={styles.actions}>
            <Pressable style={styles.primary} onPress={() => router.push('/planner')}>
              <Text style={styles.primaryText}>Wear this today</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => router.push('/wardrobe')}>
              <Text style={styles.secondaryText}>My closet</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function Header({ name, count }: { name?: string; count: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.kicker}>
        {name ? `GOOD MORNING, ${name.toUpperCase()}` : 'TODAY'}
      </Text>
      <Text style={styles.title}>Today's covers.</Text>
      <Text style={styles.sub}>
        {count > 0
          ? `Built from the ${count} ${count === 1 ? 'piece' : 'pieces'} in your closet.`
          : 'Built from your closet.'}
      </Text>
    </View>
  );
}

/**
 * `snapToInterval` is a native-only prop: react-native-web does not turn it
 * into CSS scroll-snap, so in a browser the rail free-scrolls and cards come to
 * rest half on screen. These two rules are the web equivalent. They are cast
 * through `as any` because scrollSnapType/scrollSnapAlign are not in the React
 * Native style types — they only mean anything on web, and native ignores the
 * empty object.
 */
const webSnap =
  Platform.OS === 'web'
    ? ({
        // scrollPaddingLeft so a snapped card keeps the page gutter:
        // scroll-snap-align aligns to the scrollport edge and would otherwise
        // leave every card after the first flush against the screen.
        rail: { scrollSnapType: 'x mandatory', scrollPaddingLeft: H_PADDING },
        slide: { scrollSnapAlign: 'start' },
      } as any)
    : { rail: undefined, slide: undefined };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3ede3' },
  centre: { alignItems: 'center', justifyContent: 'center' },

  header: { paddingHorizontal: H_PADDING, paddingTop: 64, paddingBottom: 18 },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: '#a39a8d', fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '700', color: '#18181b', marginTop: 6 },
  sub: { fontSize: 14, color: '#8a8278', marginTop: 4 },

  rail: { flexGrow: 0 },
  deck: { paddingHorizontal: H_PADDING, gap: 16, paddingBottom: 8 },
  slide: { width: CARD_WIDTH },
  tracksWrap: { paddingHorizontal: H_PADDING, flex: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 'auto', paddingBottom: 18 },
  primary: {
    flex: 1.6,
    backgroundColor: '#18181b',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: { color: '#f3ede3', fontWeight: '600', fontSize: 15 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d8d0c3',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryText: { color: '#18181b', fontWeight: '600', fontSize: 15 },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
    paddingBottom: 6,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d8d0c3' },
  dotOn: { backgroundColor: '#18181b', width: 18 },
  counter: { fontSize: 12, color: '#a39a8d', fontVariant: ['tabular-nums'] },

  empty: { paddingHorizontal: H_PADDING, paddingTop: 40, gap: 10 },
  emptyTitle: { fontSize: 19, fontWeight: '700', color: '#18181b' },
  emptyBody: { fontSize: 15, color: '#8a8278', lineHeight: 22 },
  cta: {
    backgroundColor: '#18181b',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  ctaText: { color: '#f3ede3', fontWeight: '600', fontSize: 15 },

  error: { color: '#d33', textAlign: 'center', marginBottom: 10 },
});
