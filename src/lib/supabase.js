import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Standard client for normal operations (respects RLS)
// Storage uploads use RLS policy: authenticated users can upload to muapi-temp/<user.id>/
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-jjpscimtxrudtepzwhag-auth-token',
    storage: window.localStorage
  }
});
