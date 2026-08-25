import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getMockNearbyPrices, getMockOnlinePrices } from '../../src/data/mockPriceMatch';
import { type DetectedItem, identifySingleItem } from '../../src/lib/scan';

export default function ScanPriceMatch() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [item, setItem] = useState<DetectedItem | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Camera/photo access is needed to scan an item.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    setItem(null);
    setError(null);
    setScanning(true);
    try {
      const detected = await identifySingleItem(uri);
      if (!detected) {
        setError("Couldn't confidently identify that item — try a clearer, closer photo.");
      }
      setItem(detected);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed.');
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setPhotoUri(null);
    setItem(null);
    setError(null);
  };

  if (!photoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Scan & Price Match</Text>
        <Text style={styles.helper}>
          See something you like in a store? Scan it to compare prices online and nearby.
        </Text>
        <View style={styles.startButtons}>
          <Pressable style={styles.photoButton} onPress={() => scan('camera')}>
            <Text style={styles.photoButtonText}>Scan an Item</Text>
          </Pressable>
          <Pressable style={styles.photoButtonOutline} onPress={() => scan('library')}>
            <Text style={styles.photoButtonOutlineText}>Choose from Library</Text>
          </Pressable>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  const online = item ? getMockOnlinePrices(item.description) : [];
  const nearby = item ? getMockNearbyPrices(item.description) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: photoUri }} style={styles.preview} />

      {scanning && (
        <View style={styles.scanning}>
          <ActivityIndicator />
          <Text style={styles.helper}>Identifying item…</Text>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {item && (
        <>
          <Text style={styles.itemTitle}>{item.description}</Text>
          <Text style={styles.itemMeta}>
            {[item.category, item.color, item.brand].filter(Boolean).join(' · ')}
          </Text>

          <Text style={styles.sectionLabel}>Online — lowest first</Text>
          {online.map((option) => (
            <Pressable
              key={option.retailer}
              style={styles.priceRow}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/search?q=${encodeURIComponent(
                    option.retailer + ' ' + item.description
                  )}`
                )
              }
            >
              <Text style={styles.priceRowLabel}>{option.retailer}</Text>
              <Text style={styles.priceRowPrice}>${option.price.toFixed(2)}</Text>
            </Pressable>
          ))}

          <Text style={styles.sectionLabel}>Nearby stores</Text>
          <Text style={styles.placeholderNote}>
            Placeholder — real in-store pricing needs retailer partnerships (Phase 5, not built
            yet). Shown for demo purposes only.
          </Text>
          {nearby.map((option) => (
            <View key={option.store} style={styles.priceRow}>
              <View>
                <Text style={styles.priceRowLabel}>{option.store}</Text>
                <Text style={styles.priceRowDistance}>{option.distanceMiles} mi away</Text>
              </View>
              <Text style={styles.priceRowPrice}>${option.price.toFixed(2)}</Text>
            </View>
          ))}
        </>
      )}

      <Pressable style={styles.scanAgainButton} onPress={reset}>
        <Text style={styles.scanAgainButtonText}>Scan another item</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  content: { paddingBottom: 32, gap: 10 },
  title: { fontSize: 24, fontWeight: '700' },
  helper: { color: '#666', marginTop: 4 },
  startButtons: { gap: 10, marginTop: 24 },
  photoButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  photoButtonText: { color: '#fff', fontWeight: '600' },
  photoButtonOutline: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  photoButtonOutlineText: { color: '#111', fontWeight: '600' },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
  },
  scanning: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  error: { color: '#d33', textAlign: 'center' },
  itemTitle: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  itemMeta: { color: '#666' },
  sectionLabel: { fontWeight: '600', marginTop: 12 },
  placeholderNote: { color: '#999', fontSize: 12, marginTop: -4, marginBottom: 4 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
  },
  priceRowLabel: { fontSize: 16, fontWeight: '600' },
  priceRowDistance: { fontSize: 12, color: '#666', marginTop: 2 },
  priceRowPrice: { fontSize: 16, fontWeight: '700' },
  scanAgainButton: {
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  scanAgainButtonText: { color: '#111', fontWeight: '600' },
});
