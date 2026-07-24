import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SwipeCard } from '../../src/components/SwipeCard';
import { useAuth } from '../../src/contexts/AuthContext';
import { MOCK_DEALS, type Deal } from '../../src/data/mockDeals';
import { recordSwipe } from '../../src/lib/swipes';

export default function Flixnder() {
  const { session } = useAuth();
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<Deal[]>([]);
  const [viewingRetailers, setViewingRetailers] = useState<Deal | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    const deal = MOCK_DEALS[index];
    if (deal && session) {
      recordSwipe(session.user.id, deal, direction === 'right' ? 'like' : 'pass');
    }
    if (direction === 'right' && deal) {
      setLiked((prev) => [...prev, deal]);
    }
    setIndex((prev) => prev + 1);
  };

  const remaining = MOCK_DEALS.slice(index, index + 2);

  if (viewingRetailers) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{viewingRetailers.title}</Text>
        <Text style={styles.subtitle}>Best prices, lowest first</Text>

        <ScrollView contentContainerStyle={{ gap: 10, marginTop: 16 }}>
          {[...viewingRetailers.retailers]
            .sort((a, b) => a.price - b.price)
            .map((retailer) => (
              <Pressable
                key={retailer.name}
                style={styles.retailerRow}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/search?q=${encodeURIComponent(
                      retailer.name + ' ' + viewingRetailers.title
                    )}`
                  )
                }
              >
                <Text style={styles.retailerName}>{retailer.name}</Text>
                <Text style={styles.retailerPrice}>${retailer.price.toFixed(2)}</Text>
              </Pressable>
            ))}
        </ScrollView>

        <Pressable
          style={styles.backButton}
          onPress={() => setViewingRetailers(null)}
        >
          <Text style={styles.backButtonText}>Back to swiping</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flixnder</Text>

      <View style={styles.deck}>
        {remaining.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.subtitle}>
              {liked.length} item{liked.length === 1 ? '' : 's'} liked so far.
              More deals coming once the affiliate feed is wired up.
            </Text>
          </View>
        ) : (
          remaining
            .map((deal, i) => (
              <SwipeCard
                key={deal.id}
                deal={deal}
                isTop={i === 0}
                onSwipe={handleSwipe}
              />
            ))
            .reverse()
        )}
      </View>

      {liked.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.likedRow}
        >
          {liked.map((deal) => (
            <Pressable
              key={deal.id}
              style={styles.likedChip}
              onPress={() => setViewingRetailers(deal)}
            >
              <Text style={styles.likedChipText}>{deal.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
  deck: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', gap: 8, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  likedRow: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  likedChip: {
    backgroundColor: '#111',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  likedChipText: { color: '#fff', fontWeight: '600' },
  retailerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
  },
  retailerName: { fontSize: 16, fontWeight: '600' },
  retailerPrice: { fontSize: 16, fontWeight: '700' },
  backButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  backButtonText: { color: '#fff', fontWeight: '600' },
});
