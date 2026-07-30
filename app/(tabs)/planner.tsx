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
  type WardrobeItem,
} from '../../src/lib/wardrobe';

export default function Planner() {
  const { session } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listWardrobeItems(session.user.id);
      setItems(data);
      const nextOutfit = buildOutfit(data);
      setOutfit(nextOutfit);
      const urls = await Promise.all(
        Object.values(nextOutfit).map(
          async (item) => [item.id, await getWardrobeImageUrl(item.image_path)] as const
        )
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

  const switchItUp = async () => {
    const nextOutfit = buildOutfit(items);
    setOutfit(nextOutfit);
    const urls = await Promise.all(
      Object.values(nextOutfit).map(
        async (item) => [item.id, await getWardrobeImageUrl(item.image_path)] as const
      )
    );
    setImageUrls((prev) => ({ ...prev, ...Object.fromEntries(urls) }));
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
