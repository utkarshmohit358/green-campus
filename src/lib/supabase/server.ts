import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey ||
    url.includes('your-project') ||
    !url.startsWith('http') ||
    anonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') ||
    anonKey.trim().length <= 10
  ) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function isSupabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      anonKey &&
      url.startsWith('http') &&
      !url.includes('your-project') &&
      !anonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') &&
      anonKey.trim().length > 10
  );
}
