import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("🌐 Supabase Config:", {
  url: supabaseUrl ? "✅ Present" : "❌ Missing",
  key: supabaseAnonKey ? "✅ Present" : "❌ Missing",
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ CRITICAL: Missing Supabase environment variables!");
  console.error("Expected: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!
)

console.log("✅ Supabase client initialized")
