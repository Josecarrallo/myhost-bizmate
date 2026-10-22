import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Standard client for normal operations (respects RLS)
// Uses publishable key from env - no hardcoded keys
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-jjpscimtxrudtepzwhag-auth-token',
    storage: window.localStorage
  }
});

// REMOVED: supabaseAdmin with service_role key
// Storage uploads now use the standard supabase client with user session
// This is more secure - service_role key should NEVER be in frontend code
