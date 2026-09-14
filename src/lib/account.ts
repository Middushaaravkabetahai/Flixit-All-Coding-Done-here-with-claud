import { supabase } from './supabase';

/**
 * Permanently deletes the signed-in user's account.
 *
 * The actual deletion happens in the `delete-account` Edge Function, because
 * removing an auth.users row requires the service-role key and that must never
 * ship inside the app. See supabase/functions/delete-account/index.ts.
 *
 * On success the user is signed out locally, which drops them back to the
 * sign-in screen via the root layout's auth guard.
 */
export async function deleteAccount(): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-account');

  if (error) throw new Error(error.message ?? 'Could not delete your account.');
  if (data?.error) throw new Error(data.error);

  // The session now points at a user that no longer exists — clear it so the
  // app doesn't sit on a dead token.
  await supabase.auth.signOut();
}
