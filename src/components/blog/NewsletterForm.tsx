"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "../../lib/supabase/client"
import { Mail } from "lucide-react"

interface NewsletterFormProps {
  isDark: boolean
}

export function NewsletterForm({ isDark }: NewsletterFormProps) {
  const [step, setStep] = useState<"email" | "details">("email")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profession: "",
    email: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submit clicked, email:", formData.email)
    console.log("Current step:", step)
    if (formData.email && formData.email.includes("@")) {
      console.log("Email valid, switching to details step")
      setStep("details")
      console.log("Step should now be 'details'")
    } else {
      console.log("Email invalid")
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setStatus("idle")
    setMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    const supabase = createClient()
    
    // Newsletter abonelik için anonymous client kullan
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        profession: formData.profession || null,
        email: formData.email,
      })
      .select()
      .single()

        if (error) {
          console.error("Newsletter abonelik hatası:", error)
          if (error.code === "23505") {
            setMessage("Bu e-posta adresi zaten abone! Teşekkürler.")
            setStatus("success") // Duplicate email'i success olarak göster
          } else if (error.message) {
            setMessage(`Hata: ${error.message}`)
            setStatus("error")
          } else {
            setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
            setStatus("error")
          }
        } else {
          console.log("Newsletter abonelik başarılı:", data)
          // Welcome email gönder (hata olsa bile abonelik başarılı)
          try {
            const { data: emailData, error: emailError } = await supabase.functions.invoke("send-welcome-email", {
              body: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName
              }
            })
            
            if (emailError) {
              console.log("Welcome email error:", emailError)
              console.log("Email data:", emailData)
            } else {
              console.log("Welcome email başarıyla gönderildi:", emailData)
            }
          } catch (emailError) {
            console.log("Welcome email catch error:", emailError)
            // Email hatası olsa bile abonelik başarılı sayılır
          }

          setMessage("Başarıyla abone oldunuz! Hoş geldiniz.")
          setStatus("success")
          setFormData({ firstName: "", lastName: "", profession: "", email: "" })
          setStep("email") // Formu başlangıca döndür
        }

    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 5000)
  }

  console.log("NewsletterForm render - step:", step)
  
  return (
    <div className="py-4">
      <div className="max-w-4xl mx-auto">
        {/* Newsletter Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Newsletter Aboneliği</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dijital pazarlama ipuçları, teknoloji haberleri ve özel içerikler için abone olun
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {/* Email Input */}
          <div className="flex-1 max-w-sm">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-primary focus:outline-none transition-colors text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          {/* Subscribe Button */}
          <button
            onClick={handleEmailSubmit}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm clickable"
          >
            Devam Et
          </button>
        </div>
        
        {/* Hidden Details Form - Only show when needed */}
        {step === "details" && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">E-posta: {formData.email}</span>
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline clickable"
              >
                Değiştir
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Ad"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="px-2 py-1 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary focus:outline-none transition-colors text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Soyad"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="px-2 py-1 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary focus:outline-none transition-colors text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <input
              type="text"
              placeholder="Meslek (opsiyonel)"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="w-full px-2 py-1 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary focus:outline-none transition-colors text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-2"
            />
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm clickable"
            >
              {status === "loading" ? "Kaydediliyor..." : "Abone Ol"}
            </button>
            {message && (
              <p className={`text-xs mt-1 font-medium ${status === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{message}</p>
            )}
          </div>
        )}

        {/* Status Message */}
        {status === "success" && (
          <div className="mt-2 text-center">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">{message}</p>
          </div>
        )}

      </div>
    </div>
  )
}
