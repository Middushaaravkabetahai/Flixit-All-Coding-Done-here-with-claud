import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';

const STYLE_OPTIONS = ['Streetwear', 'Minimalist', 'Preppy', 'Vintage', 'Athleisure', 'Formal'];

export default function Profile() {
  const { session, profile, refreshProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(profile?.style_tags ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setDisplayName(profile?.display_name ?? '');
    setSelectedStyles(profile?.style_tags ?? []);
    setError(null);
    setEditing(true);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSave = async () => {
    if (!session) return;
    setSaving(true);
    setError(null);
    try {
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: session.user.id,
        display_name: displayName.trim(),
        style_tags: selectedStyles,
        onboarding_complete: true,
      });
      if (upsertError) throw upsertError;
      await refreshProfile();
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit profile</Text>

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

        <View style={styles.editActions}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => setEditing(false)}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { flex: 1 }]}
            onPress={handleSave}
            disabled={saving || !displayName.trim()}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
          </Pressable>
        </View>
      </View>
    );
  }

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

      <Pressable style={[styles.button, styles.editButton]} onPress={startEditing}>
        <Text style={styles.editButtonText}>Edit profile</Text>
      </Pressable>

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
  error: { color: '#d33' },
  button: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  editButton: { backgroundColor: '#eee', marginTop: 'auto', marginBottom: 0 },
  editButtonText: { color: '#111', fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { backgroundColor: '#eee', flex: 1 },
  cancelButtonText: { color: '#111', fontWeight: '600' },
});
