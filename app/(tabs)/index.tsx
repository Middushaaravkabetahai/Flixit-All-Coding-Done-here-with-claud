import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { MOCK_DEALS, type Deal } from '../../src/data/mockDeals';
import { getCategoryPreferences } from '../../src/lib/swipes';

export default function FYP() {
  const { session } = useAuth();
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      if (!session) return;

      setLoading(true);
      getCategoryPreferences(session.user.id).then((scores) => {
        if (cancelled) return;
        const ranked = [...MOCK_DEALS].sort(
          (a, b) => (scores[b.category] ?? 0) - (scores[a.category] ?? 0)
        );
        setDeals(ranked);
        setLoading(false);
      });

      return () => {
        cancelled = true;
      };
    }, [session])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your FYP</Text>
      <Text style={styles.subtitle}>
        Ranked by what you've liked in Flixnder so far.
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingTop: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPrice}>
                From ${Math.min(...item.retailers.map((r) => r.price)).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  card: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 8,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#e5e5e5',
  },
  cardTitle: { fontWeight: '600' },
  cardPrice: { color: '#666', fontSize: 12 },
});
