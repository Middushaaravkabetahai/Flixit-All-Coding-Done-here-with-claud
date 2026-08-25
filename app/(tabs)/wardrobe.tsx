import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import {
  getWardrobeImageUrl,
  listWardrobeItems,
  uploadWardrobeItem,
  type WardrobeItem,
} from '../../src/lib/wardrobe';

const CATEGORIES = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'];

export default function Wardrobe() {
  const router = useRouter();
  const { session } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await listWardrobeItems(session.user.id);
      setItems(data);
      const urls = await Promise.all(
        data.map(async (item) => [item.id, await getWardrobeImageUrl(item.image_path)] as const)
      );
      setImageUrls(Object.fromEntries(urls));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load wardrobe');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library access is needed to add wardrobe items.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPendingUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!session || !pendingUri) return;
    setSaving(true);
    setError(null);
    try {
      await uploadWardrobeItem({
        userId: session.user.id,
        localImageUri: pendingUri,
        category,
        color: color.trim() || undefined,
        brand: brand.trim() || undefined,
      });
      setPendingUri(null);
      setColor('');
      setBrand('');
      setCategory(CATEGORIES[0]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wardrobe</Text>
        <View style={styles.headerButtons}>
          <Pressable
            style={styles.scanButton}
            onPress={() => router.push('/scan-closet')}
          >
            <Text style={styles.scanButtonText}>Scan Closet</Text>
          </Pressable>
          <Pressable style={styles.addButton} onPress={pickImage}>
            <Text style={styles.addButtonText}>+ Add item</Text>
          </Pressable>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>
          No items yet. Photograph a piece of clothing to start building your
          closet.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {imageUrls[item.id] && (
                <Image
                  source={{ uri: imageUrls[item.id] }}
                  style={styles.cardImage}
                />
              )}
              <Text style={styles.cardCategory}>{item.category}</Text>
              {(item.brand || item.color) && (
                <Text style={styles.cardMeta}>
                  {[item.brand, item.color].filter(Boolean).join(' · ')}
                </Text>
              )}
            </View>
          )}
        />
      )}

      <Modal visible={pendingUri !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {pendingUri && (
              <Image source={{ uri: pendingUri }} style={styles.previewImage} />
            )}

            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.chip, category === c && styles.chipSelected]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      category === c && styles.chipTextSelected,
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Color (optional)"
              value={color}
              onChangeText={setColor}
            />
            <TextInput
              style={styles.input}
              placeholder="Brand (optional)"
              value={brand}
              onChangeText={setBrand}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setPendingUri(null)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: { fontSize: 24, fontWeight: '700' },
  headerButtons: { flexDirection: 'row', gap: 8 },
  scanButton: {
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  scanButtonText: { color: '#111', fontWeight: '600' },
  addButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 48, paddingHorizontal: 24 },
  error: { color: '#d33', textAlign: 'center', marginTop: 12 },
  card: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 8,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#e5e5e5',
  },
  cardCategory: { fontWeight: '600' },
  cardMeta: { color: '#666', fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e5e5e5',
    marginBottom: 8,
  },
  label: { fontWeight: '600', marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  button: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  cancelButton: { backgroundColor: '#eee' },
  cancelButtonText: { color: '#111', fontWeight: '600' },
});
