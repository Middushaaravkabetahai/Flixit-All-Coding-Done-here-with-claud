import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { type DetectedItem, identifyClosetItems } from '../src/lib/scan';
import { uploadWardrobeItem } from '../src/lib/wardrobe';

const CATEGORIES = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'];

type ReviewItem = DetectedItem & { include: boolean };

export default function ScanCloset() {
  const router = useRouter();
  const { session } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const takePhoto = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Camera/photo access is needed to scan your closet.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    setError(null);
    setScanning(true);
    try {
      const detected = await identifyClosetItems(uri);
      if (detected.length === 0) {
        setError("Couldn't confidently identify any items in that photo — try a clearer shot.");
      }
      setItems(detected.map((item) => ({ ...item, include: true })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed.');
    } finally {
      setScanning(false);
    }
  };

  const updateItem = (index: number, patch: Partial<ReviewItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const saveAll = async () => {
    if (!session || !photoUri) return;
    const toSave = items.filter((item) => item.include);
    if (toSave.length === 0) return;

    setSaving(true);
    setError(null);
    try {
      // All detected items share the source closet photo — there's no
      // per-item cropping yet, so each wardrobe row points at the same
      // image. Good enough to seed the closet fast; swap for cropped
      // per-item photos later if that turns out to matter.
      for (const item of toSave) {
        await uploadWardrobeItem({
          userId: session.user.id,
          localImageUri: photoUri,
          category: CATEGORIES.includes(item.category) ? item.category : 'Top',
          color: item.color ?? undefined,
          brand: item.brand ?? undefined,
        });
      }
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save items.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Scan Closet</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!photoUri && (
          <>
            <Text style={styles.helper}>
              Take one photo of your closet or a rack of clothes — Claude will pick out each item
              so you can bulk-add them instead of one at a time.
            </Text>
            <Pressable style={styles.photoButton} onPress={() => takePhoto('camera')}>
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.photoButtonOutline} onPress={() => takePhoto('library')}>
              <Text style={styles.photoButtonOutlineText}>Choose from Library</Text>
            </Pressable>
          </>
        )}

        {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

        {error && <Text style={styles.error}>{error}</Text>}

        {scanning && (
          <View style={styles.scanning}>
            <ActivityIndicator />
            <Text style={styles.helper}>Identifying items…</Text>
          </View>
        )}

        {!scanning && items.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              Found {items.length} item{items.length === 1 ? '' : 's'} — review and edit before
              saving
            </Text>
            {items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Switch
                    value={item.include}
                    onValueChange={(value) => updateItem(index, { include: value })}
                  />
                </View>

                <View style={styles.chipRow}>
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => updateItem(index, { category: c })}
                      style={[styles.chip, item.category === c && styles.chipSelected]}
                    >
                      <Text
                        style={[styles.chipText, item.category === c && styles.chipTextSelected]}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Color"
                    value={item.color ?? ''}
                    onChangeText={(text) => updateItem(index, { color: text || null })}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Brand"
                    value={item.brand ?? ''}
                    onChangeText={(text) => updateItem(index, { brand: text || null })}
                  />
                </View>
              </View>
            ))}

            <Pressable style={styles.saveButton} onPress={saveAll} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save {items.filter((i) => i.include).length} item
                  {items.filter((i) => i.include).length === 1 ? '' : 's'}
                </Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  back: { color: '#666', fontSize: 16, width: 50 },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 16, gap: 12 },
  helper: { color: '#666', textAlign: 'center', marginBottom: 8 },
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
  error: { color: '#d33', textAlign: 'center' },
  scanning: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  sectionLabel: { fontWeight: '600', marginTop: 8 },
  itemCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDescription: { fontWeight: '600', flex: 1, marginRight: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  chipSelected: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111', fontSize: 13 },
  chipTextSelected: { color: '#fff' },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: { color: '#fff', fontWeight: '600' },
});
