"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "../../lib/supabase/client"
import { Mail } from "lucide-react"

interface NewsletterFormProps {
  isDark: boolean
}

export function NewsletterFormSimple({ isDark }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    const supabase = createClient()
    
    // Sadece email ile basit abonelik (mevcut şemaya uygun)
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email,
        is_active: true,
        subscribed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error("Newsletter abonelik hatası:", error)
      if (error.code === "23505") {
        setMessage("Bu e-posta adresi zaten kayıtlı.")
      } else if (error.message) {
        setMessage(`Hata: ${error.message}`)
      } else {
        setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
      }
      setStatus("error")
    } else {
      console.log("Newsletter abonelik başarılı:", data)
      
      // Welcome email gönder (basit versiyon)
      try {
        await supabase.functions.invoke("send-welcome-email", {
          body: {
            email: email,
            firstName: email.split('@')[0], // Email'den isim türet
            lastName: "",
            gender: "unknown"
          }
        })
      } catch (emailError) {
        console.log("Welcome email gönderilemedi:", emailError)
        // Email hatası olsa bile abonelik başarılı sayılır
      }

      setMessage("Başarıyla abone oldunuz! Hoş geldiniz.")
      setStatus("success")
      setEmail("")
    }

    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 5000)
  }

  return (
    <div className="mt-20 pt-20 border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
          <Mail className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Yeni içeriklerden haberdar olun</h2>
        <p className="text-lg text-muted-foreground mb-8 text-pretty">
          Her yeni blog yazısında size özel bildirim göndereceğiz
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 clickable"
          >
            {status === "loading" ? "Kaydediliyor..." : "Abone Ol"}
          </button>

          {message && (
            <p className={`text-sm ${status === "error" ? "text-destructive" : "text-primary"}`}>{message}</p>
          )}
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          Abonelikten çıkmak için e-postalarımızdaki "Abonelikten Ayrıl" linkini kullanabilirsiniz.
        </p>
      </div>
    </div>
  )
}
