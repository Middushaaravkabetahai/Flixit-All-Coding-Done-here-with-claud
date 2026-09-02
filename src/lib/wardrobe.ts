import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

export type WardrobeItem = {
  id: string;
  image_path: string;
  category: string;
  color: string | null;
  brand: string | null;
  created_at: string;
};

export type NewWardrobeItem = {
  userId: string;
  localImageUri: string;
  category: string;
  color?: string;
  brand?: string;
};

export async function uploadWardrobeItem({
  userId,
  localImageUri,
  category,
  color,
  brand,
}: NewWardrobeItem): Promise<WardrobeItem> {
  const fileExt = localImageUri.split('.').pop() ?? 'jpg';
  const fileName = `${Date.now()}.${fileExt}`;
  const storagePath = `${userId}/${fileName}`;

  const base64 = await FileSystem.readAsStringAsync(localImageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const arrayBuffer = decodeBase64(base64);

  const { error: uploadError } = await supabase.storage
    .from('wardrobe-photos')
    .upload(storagePath, arrayBuffer, {
      contentType: `image/${fileExt}`,
    });
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from('wardrobe_items')
    .insert({
      user_id: userId,
      image_path: storagePath,
      category,
      color: color ?? null,
      brand: brand ?? null,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  return data;
}

export async function listWardrobeItems(userId: string): Promise<WardrobeItem[]> {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('id, image_path, category, color, brand, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Deletes the wardrobe row, and the underlying storage photo too — unless
// another item still points at it (Scan Closet saves several items against
// one shared source photo, so deleting one shouldn't break the others).
export async function deleteWardrobeItem(userId: string, item: WardrobeItem): Promise<void> {
  const { error: deleteError } = await supabase
    .from('wardrobe_items')
    .delete()
    .eq('id', item.id)
    .eq('user_id', userId);
  if (deleteError) throw deleteError;

  const { count } = await supabase
    .from('wardrobe_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('image_path', item.image_path);

  if (!count) {
    await supabase.storage.from('wardrobe-photos').remove([item.image_path]);
  }
}

// The bucket is private, so items need a signed URL rather than a public one.
export async function getWardrobeImageUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('wardrobe-photos')
    .createSignedUrl(storagePath, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

function decodeBase64(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
