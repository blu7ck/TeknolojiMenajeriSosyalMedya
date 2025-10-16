import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  console.log("🔧 Supabase config:", { 
    url: url ? `${url.substring(0, 30)}...` : 'MISSING', 
    key: key ? `${key.substring(0, 20)}...` : 'MISSING' 
  })

  if (!url || !key) {
    throw new Error("Supabase URL or ANON_KEY is missing!")
  }

  supabaseClient = createBrowserClient(url, key)
  console.log("✅ Supabase client initialized")

  return supabaseClient
}
