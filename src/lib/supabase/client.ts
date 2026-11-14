import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_CUSTOM_URL = 'greencampus_supabase_url';
const STORAGE_KEY_CUSTOM_KEY = 'greencampus_supabase_anon_key';

export function getSupabaseCredentials(): { url: string | null; anonKey: string | null; isCustom: boolean } {
  // Check localStorage if running in browser first for custom overrides
  if (typeof window !== 'undefined') {
    try {
      const customUrl = localStorage.getItem(STORAGE_KEY_CUSTOM_URL);
      const customKey = localStorage.getItem(STORAGE_KEY_CUSTOM_KEY);
      if (customUrl || customKey) {
        const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        return {
          url: customUrl || (envUrl && !envUrl.includes('your-project') ? envUrl : null),
          anonKey: customKey || (envKey && !envKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') ? envKey : null),
          isCustom: true,
        };
      }
    } catch {
      // ignore
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const validUrl = envUrl && !envUrl.includes('your-project') ? envUrl.trim() : null;
  const validKey = envKey && !envKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') && envKey.trim().length > 10 ? envKey.trim() : null;

  return { url: validUrl, anonKey: validKey, isCustom: false };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.trim().length > 10);
}

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;

  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  if (!browserClient) {
    try {
      browserClient = createBrowserClient(url, anonKey);
    } catch {
      browserClient = createClient(url, anonKey);
    }
  }

  return browserClient;
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, anonKey.trim());
    browserClient = null; // reset client instance
  } catch {
    // ignore
  }
}

export function clearCustomSupabaseCredentials(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_URL);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_KEY);
    browserClient = null;
  } catch {
    // ignore
  }
}
