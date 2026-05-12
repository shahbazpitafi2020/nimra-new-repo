import { supabase } from "@/lib/supabase";

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

export async function uploadStorageFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicData.publicUrl;
}
