"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createClient } from "../lib/supabase/client"
import { AdminLogin } from "../components/admin/AdminLogin"
import { AdminDashboard } from "../components/admin/AdminDashboard"
import { Lock } from "lucide-react"

const ADMIN_PASSWORD = "130113" // Basit şifre koruması

export function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    navigate("/")
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedPassword = passwordInput.trim()
    
    if (trimmedPassword === ADMIN_PASSWORD) {
      setIsPasswordVerified(true)
      setPasswordError("")
    } else {
      setPasswordError("Hatalı şifre!")
      setPasswordInput("")
    }
  }

  // Şifre kontrolü ekranı
  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-blue-400/50">
                <Lock className="w-10 h-10 text-blue-300" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-white mb-2">Erişim Korumalı</h1>
            <p className="text-center text-blue-200 mb-8">Devam etmek için şifre girin</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-blue-200/50 backdrop-blur-sm text-center text-lg tracking-widest"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              {passwordError && (
                <p className="text-sm text-red-300 text-center bg-red-500/20 py-2 px-4 rounded-lg border border-red-400/30">
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Doğrula
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onSuccess={checkUser} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}
