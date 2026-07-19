import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';

const STYLE_OPTIONS = [
  'Streetwear',
  'Minimalist',
  'Preppy',
  'Vintage',
  'Athleisure',
  'Formal',
];

export default function ProfileSetup() {
  const { session, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const handleSave = async () => {
    if (!session) return;
    setError(null);
    setLoading(true);
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: session.user.id,
      display_name: displayName.trim(),
      style_tags: selectedStyles,
      onboarding_complete: true,
    });
    setLoading(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    await refreshProfile();
    // The root layout's redirect effect takes it from here to the tabs.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us about your style</Text>
      <Text style={styles.subtitle}>
        This tunes your FYP. You can change it later.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Display name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <View style={styles.chipRow}>
        {STYLE_OPTIONS.map((style) => {
          const selected = selectedStyles.includes(style);
          return (
            <Pressable
              key={style}
              onPress={() => toggleStyle(style)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {style}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={styles.button}
        onPress={handleSave}
        disabled={loading || !displayName.trim()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginVertical: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipSelected: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },
  chipTextSelected: { color: '#fff' },
  button: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#d33', textAlign: 'center' },
});
