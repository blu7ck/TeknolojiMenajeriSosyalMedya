import { createBrowserClient } from "@supabase/ssr"

let adminClient: ReturnType<typeof createBrowserClient> | null = null

export function createAdminClient() {
  if (adminClient) {
    return adminClient
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY // Use anon key for now

  console.log("🔧 Admin Supabase config:", { 
    url: url ? `${url.substring(0, 30)}...` : 'MISSING', 
    key: key ? `${key.substring(0, 20)}...` : 'MISSING' 
  })

  if (!url || !key) {
    throw new Error("Supabase URL or SERVICE_ROLE_KEY is missing!")
  }

  adminClient = createBrowserClient(url, key)
  console.log("✅ Admin Supabase client initialized")

  return adminClient
}
