import { createClient } from '@supabase/supabase-js'

// 1. Resolve Environment Variables
// We check import.meta.env (Vite build-time) first, 
// then fallback to process.env (Cloudflare runtime with nodejs_compat)
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : "") || 
  "";

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : "") || 
  "";

const isServer = typeof window === 'undefined';

// Log status only during development or server startup to avoid log spam in production
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase configuration is missing! Check your environment variables.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    global: {
      // 2. Explicitly provide the fetch function.
      // In Cloudflare Workers, 'fetch' is a global function.
      // This fixes the "Cannot read properties of undefined (reading 'fetch')" error.
      fetch: (...args) => fetch(...args),
    },
    auth: {
      // 3. Disable persistence on the server side to prevent SSR crashes
      persistSession: !isServer,
      detectSessionInUrl: !isServer,
    },
  }
)

// Debug log for Cloudflare Real-time Logs
if (isServer) {
  console.log("🚀 Supabase SSR Client Initialized for Cloudflare Worker");
}