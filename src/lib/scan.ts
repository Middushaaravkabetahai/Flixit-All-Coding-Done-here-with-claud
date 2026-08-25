// Phase 4 (Smart Scanning) client. Talks to the identify-clothing-items
// Supabase Edge Function, which does the actual Claude vision call — the
// vision API key lives server-side only (see supabase/functions/.../index.ts).
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

export type DetectedItem = {
  category: string;
  color: string | null;
  brand: string | null;
  description: string;
};

async function toBase64(localImageUri: string): Promise<string> {
  return FileSystem.readAsStringAsync(localImageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

// One closet/rack photo -> several detected items, for bulk wardrobe add.
export async function identifyClosetItems(localImageUri: string): Promise<DetectedItem[]> {
  const image = await toBase64(localImageUri);
  const { data, error } = await supabase.functions.invoke('identify-clothing-items', {
    body: { image, mode: 'closet' },
  });
  if (error) throw new Error(error.message ?? 'Scan failed.');
  if (data?.error) throw new Error(data.error);
  return data?.items ?? [];
}

// One single-item photo (e.g. in a store) -> one detected item, for
// Scan & Price Match.
export async function identifySingleItem(localImageUri: string): Promise<DetectedItem | null> {
  const image = await toBase64(localImageUri);
  const { data, error } = await supabase.functions.invoke('identify-clothing-items', {
    body: { image, mode: 'item' },
  });
  if (error) throw new Error(error.message ?? 'Scan failed.');
  if (data?.error) throw new Error(data.error);
  return data?.item ?? null;
}
