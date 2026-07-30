import { useCallback, useState } from 'react';
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
  hasEnoughForOutfit,
  OUTFIT_SLOTS,
  type Outfit,
} from '../../src/lib/outfitPlanner';
import {
  getWardrobeImageUrl,
  listWardrobeItems,
  OCCASIONS,
  type Occasion,
  type WardrobeItem,
} from '../../src/lib/wardrobe';

export default function Planner() {
  const { session } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [occasion, setOccasion] = useState<Occasion>(OCCASIONS[0]);
  const [outfit, setOutfit] = useState<Outfit>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rebuildOutfit = async (pool: WardrobeItem[], forOccasion: Occasion) => {
    const nextOutfit = buildOutfit(pool, forOccasion);
    setOutfit(nextOutfit);
    const urls = await Promise.all(
      Object.values(nextOutfit).map(
        async (item) => [item.id, await getWardrobeImageUrl(item.image_path)] as const
      )
    );
    setImageUrls((prev) => ({ ...prev, ...Object.fromEntries(urls) }));
  };

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listWardrobeItems(session.user.id);
      setItems(data);
      await rebuildOutfit(data, occasion);
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

  const selectOccasion = (next: Occasion) => {
    setOccasion(next);
    rebuildOutfit(items, next);
  };

  const switchItUp = () => rebuildOutfit(items, occasion);

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

      <View style={styles.chipRow}>
        {OCCASIONS.map((o) => (
          <Pressable
            key={o}
            onPress={() => selectOccasion(o)}
            style={[styles.chip, occasion === o && styles.chipSelected]}
          >
            <Text style={[styles.chipText, occasion === o && styles.chipTextSelected]}>
              {o}
            </Text>
          </Pressable>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {!hasEnoughForOutfit(items, occasion) ? (
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
                  {imageUrls[item.id] && (
                    <Image
                      source={{ uri: imageUrls[item.id] }}
                      style={styles.slotImage}
                    />
                  )}
                  <View>
                    <Text style={styles.slotLabel}>{slot}</Text>
                    {(item.brand || item.color) && (
                      <Text style={styles.slotMeta}>
                        {[item.brand, item.color].filter(Boolean).join(' · ')}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable style={styles.switchButton} onPress={switchItUp}>
            <Text style={styles.switchButtonText}>Switch it up</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },
  chipTextSelected: { color: '#fff' },
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
});
