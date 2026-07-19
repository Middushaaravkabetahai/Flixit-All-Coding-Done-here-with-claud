import { StyleSheet, Text, View } from 'react-native';

export default function Flixnder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flixnder</Text>
      <Text style={styles.subtitle}>
        Swipe on clothes and find the best prices — coming in Phase 2 once the
        affiliate deal feed is wired up.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center' },
});
