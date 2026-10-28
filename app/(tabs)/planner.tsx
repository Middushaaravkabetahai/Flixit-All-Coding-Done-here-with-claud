import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  buildOutfit,
  dailySeed,
  hasEnoughForOutfit,
  OUTFIT_SLOTS,
  reRollableSlots,
  type Outfit,
} from '../../src/lib/outfitPlanner';
import {
  getWardrobeImageUrl,
  listWardrobeItems,
  type WardrobeItem,
} from '../../src/lib/wardrobe';

export default function Planner() {
  const { session } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // What the closet looked like when the outfit on screen was built. Leaving
  // the tab and coming back should NOT silently deal a new outfit — it is
  // "Today's Fit", so it only changes when the day changes, when the closet
  // changes, or when you ask for a new one.
  const builtFrom = useRef<string | null>(null);

  const loadImages = async (target: Outfit) => {
    const urls = await Promise.all(
      Object.values(target).map(
        async (item) => [item.id, await getWardrobeImageUrl(item.image_path)] as const
      )
    );
    setImageUrls((prev) => ({ ...prev, ...Object.fromEntries(urls) }));
  };

  const load = useCallback(async () => {
    if (!session) return;
    setError(null);
    try {
      const data = await listWardrobeItems(session.user.id);
      setItems(data);

      // Seeded on the user and today's local date, so the same outfit comes
      // back on every open until tomorrow.
      const signature = `${dailySeed(session.user.id)}:${data
        .map((item) => item.id)
        .sort()
        .join(',')}`;
      if (builtFrom.current === signature) return;
      builtFrom.current = signature;

      const nextOutfit = buildOutfit(data, { seed: dailySeed(session.user.id) });
      setOutfit(nextOutfit);
      await loadImages(nextOutfit);
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

  const switchItUp = async () => {
    // `avoid` is what stops a re-roll dealing the identical outfit back. Every
    // slot with more than one item in it is guaranteed to change.
    const nextOutfit = buildOutfit(items, { avoid: outfit });
    setOutfit(nextOutfit);
    await loadImages(nextOutfit);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={{ marginTop: 32 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Fit</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {!hasEnoughForOutfit(items) ? (
        <Text style={styles.empty}>
          Add at least a top and a bottom in the Wardrobe tab, and your daily
          outfit planner shows up here.
        </Text>
      ) : (
        <>
          <View style={styles.slots}>
            {OUTFIT_SLOTS.map((slot) => {
              const item = outfit[slot];
              if (!item) return null;
              return (
                <View key={slot} style={styles.slotCard}>
                  {/* Boolean() for the same reason as in the Closet tab: an
                      empty string is falsy but still renders, and a text node
                      inside a View throws on native. */}
                  {Boolean(imageUrls[item.id]) && (
                    <Image
                      source={{ uri: imageUrls[item.id] }}
                      style={styles.slotImage}
                    />
                  )}
                  <View>
                    <Text style={styles.slotLabel}>{slot}</Text>
                    {Boolean(item.brand || item.color) && (
                      <Text style={styles.slotMeta}>
                        {[item.brand, item.color].filter(Boolean).join(' · ')}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* With one item per category there is nothing to swap to, so the
              button is replaced rather than left there doing nothing. */}
          {reRollableSlots(items) > 0 ? (
            <Pressable style={styles.switchButton} onPress={switchItUp}>
              <Text style={styles.switchButtonText}>Switch it up</Text>
            </Pressable>
          ) : (
            <Text style={styles.hint}>
              Add a second top, bottom or pair of shoes and you can switch this
              outfit up.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#666', marginTop: 48, paddingHorizontal: 24 },
  error: { color: '#d33', textAlign: 'center', marginBottom: 12 },
  slots: { gap: 12 },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    gap: 12,
  },
  slotImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#e5e5e5',
  },
  slotLabel: { fontWeight: '700' },
  slotMeta: { color: '#666', fontSize: 12 },
  switchButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  switchButtonText: { color: '#fff', fontWeight: '600' },
  hint: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
});
