import { Slot, useRouter, useSegments, type ErrorBoundaryProps } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { isSupabaseConfigured } from '../src/lib/supabase';

/**
 * Catches any error thrown anywhere below this layout, which is the whole app.
 *
 * Without it, one unhandled error drops the user on a blank screen in a release
 * build with no way out but force-quitting. Expo Router picks this up purely
 * from the export name; `retry` re-renders the route that threw, so a transient
 * failure (a dropped request mid-load) recovers without restarting the app.
 *
 * The raw message is shown deliberately. It looks unpolished, but it is the
 * difference between a user saying "it broke" and them sending a screenshot we
 * can actually act on, which matters a lot in the first weeks after launch.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong.</Text>
      <Text style={styles.errorBody}>
        That is our fault, not yours. Your closet is safe. Try again, and if it keeps
        happening send us the message below.
      </Text>

      <ScrollView style={styles.errorDetail} contentContainerStyle={{ padding: 14 }}>
        <Text style={styles.errorDetailText}>{error.message}</Text>
      </ScrollView>

      <Pressable style={styles.errorButton} onPress={retry}>
        <Text style={styles.errorButtonText}>Try again</Text>
      </Pressable>

      <Text style={styles.errorContact}>flixitteam@gmail.com</Text>
    </View>
  );
}

function SetupRequired() {
  return (
    <View style={styles.setupContainer}>
      <Text style={styles.setupTitle}>Almost there</Text>
      <Text style={styles.setupBody}>
        Flixit needs a Supabase project to store accounts and wardrobe data. Nothing works — not
        even sign up — until that's connected.
      </Text>
      <View style={styles.setupSteps}>
        <Text style={styles.setupStep}>1. Create a free project at supabase.com</Text>
        <Text style={styles.setupStep}>
          2. Run supabase/schema.sql in its SQL editor
        </Text>
        <Text style={styles.setupStep}>
          3. Copy .env.example to .env and fill in your project URL + anon key
          {'\n'}(Project Settings → API)
        </Text>
        <Text style={styles.setupStep}>4. Restart the app</Text>
      </View>
      <Text style={styles.setupNote}>Full steps are in README.md.</Text>
    </View>
  );
}

function RootNavigation() {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (session && !profile?.onboarding_complete && !inAuthGroup) {
      router.replace('/(auth)/profile-setup');
    } else if (session && profile?.onboarding_complete && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, profile, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  setupContainer: { flex: 1, justifyContent: 'center', padding: 28, gap: 8 },
  setupTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  setupBody: { color: '#666', textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  setupSteps: { gap: 12, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16 },
  setupStep: { fontSize: 14, lineHeight: 20 },
  setupNote: { color: '#999', fontSize: 12, textAlign: 'center', marginTop: 16 },

  errorContainer: { flex: 1, justifyContent: 'center', padding: 28, gap: 10 },
  errorTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  errorBody: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
  errorDetail: {
    maxHeight: 140,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  errorDetailText: { fontSize: 12.5, color: '#444', lineHeight: 18 },
  errorButton: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  errorButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorContact: { color: '#999', fontSize: 12, textAlign: 'center', marginTop: 4 },
});
