// Deletes the calling user's account and everything attached to it.
//
// Both the App Store and Play Store REQUIRE an app with accounts to offer
// account deletion from inside the app — it's a submission blocker, not a
// nice-to-have.
//
// Why this has to be an Edge Function: removing a row from auth.users needs
// the service-role key, which must never ship inside the app. So the client
// calls this, and this verifies who they are before deleting anything.
//
// What gets deleted:
//   - every file under wardrobe-photos/<userId>/  (storage has no cascade)
//   - the auth.users row, which CASCADES to profiles, wardrobe_items and
//     swipes via their foreign keys (see supabase/schema.sql)
//
// Deploy: supabase functions deploy delete-account
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by
// Supabase — you do NOT need to set them as secrets.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return json({ error: 'Server is misconfigured. Contact support.' }, 500);
  }

  // 1. Identify the caller from their JWT. Never trust a user id sent in the
  //    body — that would let anyone delete anyone else's account.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Not signed in.' }, 401);

  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await callerClient.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: 'Not signed in.' }, 401);
  }

  const userId = userData.user.id;
  const admin = createClient(supabaseUrl, serviceRoleKey);

  try {
    // 2. Storage is not covered by the database cascade, so clear it first.
    //    Done before the user row so a failure here leaves the account intact
    //    and retryable, rather than orphaning files nobody can reach.
    const { data: files } = await admin.storage.from('wardrobe-photos').list(userId, {
      limit: 1000,
    });

    if (files && files.length > 0) {
      const paths = files.map((file) => `${userId}/${file.name}`);
      const { error: removeError } = await admin.storage.from('wardrobe-photos').remove(paths);
      if (removeError) throw removeError;
    }

    // 3. Deleting the auth user cascades to profiles, wardrobe_items, swipes.
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return json({ success: true });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : 'Could not delete the account.' },
      500
    );
  }
});
