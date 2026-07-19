import { StyleSheet, Text, View } from 'react-native';

export default function FYP() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your FYP</Text>
      <Text style={styles.subtitle}>
        Curated deals matching your style land here — coming in Phase 2 once
        Flixnder starts training your preferences.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center' },
});
