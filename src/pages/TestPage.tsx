import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase/client'

export default function TestPage() {
  const [envStatus, setEnvStatus] = useState<{
    url: boolean
    key: boolean
    supabaseConnected: boolean
    error?: string
  }>({
    url: false,
    key: false,
    supabaseConnected: false
  })

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Environment variables kontrolü
        const url = import.meta.env.VITE_SUPABASE_URL
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        setEnvStatus(prev => ({
          ...prev,
          url: !!url,
          key: !!key
        }))

        if (!url || !key) {
          setEnvStatus(prev => ({
            ...prev,
            error: 'Environment variables missing'
          }))
          return
        }

        // Supabase bağlantı testi
        const supabase = createClient()
        const { data, error } = await supabase
          .from('blog_posts')
          .select('count', { count: 'exact' })
          .limit(1)

        setEnvStatus(prev => ({
          ...prev,
          supabaseConnected: !error,
          error: error?.message
        }))

      } catch (err) {
        setEnvStatus(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Unknown error'
        }))
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔧 Sistem Test Sayfası</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={envStatus.url ? 'text-green-500' : 'text-red-500'}>
                {envStatus.url ? '✅' : '❌'}
              </span>
              <span>VITE_SUPABASE_URL: {envStatus.url ? 'OK' : 'MISSING'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={envStatus.key ? 'text-green-500' : 'text-red-500'}>
                {envStatus.key ? '✅' : '❌'}
              </span>
              <span>VITE_SUPABASE_ANON_KEY: {envStatus.key ? 'OK' : 'MISSING'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Supabase Connection</h2>
          <div className="flex items-center gap-2">
            <span className={envStatus.supabaseConnected ? 'text-green-500' : 'text-red-500'}>
              {envStatus.supabaseConnected ? '✅' : '❌'}
            </span>
            <span>
              {envStatus.supabaseConnected 
                ? 'Connected successfully' 
                : `Connection failed: ${envStatus.error || 'Unknown error'}`
              }
            </span>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Environment Values</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}
            </div>
            <div>
              <strong>KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
                `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 
                'NOT SET'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
