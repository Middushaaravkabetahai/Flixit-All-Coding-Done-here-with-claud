import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Profile() {
  const { session, profile, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile?.display_name ?? 'Your profile'}</Text>
      <Text style={styles.email}>{session?.user.email}</Text>

      {profile?.style_tags && profile.style_tags.length > 0 && (
        <View style={styles.chipRow}>
          {profile.style_tags.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  email: { color: '#666' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipText: { color: '#111' },
  button: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
