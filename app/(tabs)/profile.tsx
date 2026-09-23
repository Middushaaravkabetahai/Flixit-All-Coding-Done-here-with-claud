import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { deleteAccount } from '../../src/lib/account';
import { supabase } from '../../src/lib/supabase';

const STYLE_OPTIONS = ['Streetwear', 'Minimalist', 'Preppy', 'Vintage', 'Athleisure', 'Formal'];

export default function Profile() {
  const { session, profile, refreshProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(profile?.style_tags ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [working, setWorking] = useState(false);

  const handleDelete = async () => {
    setWorking(true);
    setError(null);
    try {
      await deleteAccount();
      // signOut inside deleteAccount clears the session; the root layout's
      // auth guard sends us to sign-in from here.
      setDeleting(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete your account.');
    } finally {
      setWorking(false);
    }
  };

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

      {/* Both stores expect the privacy policy to be reachable from inside an
          app that holds accounts, not only from the store listing. */}
      <Pressable onPress={() => Linking.openURL('https://flixit.info/privacy/')}>
        <Text style={styles.policyLink}>Privacy policy</Text>
      </Pressable>

      <Pressable onPress={() => { setConfirmText(''); setError(null); setDeleting(true); }}>
        <Text style={styles.deleteLink}>Delete account</Text>
      </Pressable>

      <Modal visible={deleting} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete your account?</Text>
            <Text style={styles.modalBody}>
              This permanently deletes your profile, every item in your closet, the photos behind
              them, and your swipe history. It can't be undone.
            </Text>

            <Text style={styles.modalLabel}>Type DELETE to confirm</Text>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="DELETE"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.button, styles.cancelButton, { flex: 1, marginTop: 0 }]}
                onPress={() => setDeleting(false)}
                disabled={working}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.destructiveButton,
                  { flex: 1, marginTop: 0 },
                  confirmText !== 'DELETE' && styles.buttonDisabled,
                ]}
                onPress={handleDelete}
                disabled={working || confirmText !== 'DELETE'}
              >
                {working ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Delete forever</Text>
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
  policyLink: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 14,
  },
  deleteLink: {
    color: '#d33',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 22, gap: 10 },
  modalTitle: { fontSize: 19, fontWeight: '700' },
  modalBody: { color: '#666', fontSize: 14.5, lineHeight: 20 },
  modalLabel: { fontWeight: '600', fontSize: 13, marginTop: 6 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  destructiveButton: { backgroundColor: '#d33' },
  buttonDisabled: { opacity: 0.4 },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { backgroundColor: '#eee', flex: 1 },
  cancelButtonText: { color: '#111', fontWeight: '600' },
});
