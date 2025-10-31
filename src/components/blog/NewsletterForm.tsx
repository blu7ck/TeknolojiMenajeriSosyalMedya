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
    <div className="py-4 px-4 sm:px-8" style={{ backgroundColor: "#151516" }}>
      <div className="flex w-full flex-col items-start gap-4">
        {step === "email" && (
          <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-2 text-white sm:flex-shrink-0">
              <Mail className="h-4 w-4 text-red-500" />
              <span className="text-sm sm:whitespace-nowrap">Güncel teknoloji haberlerini kaçırmamak için abone olun.</span>
            </div>

            <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-4">
              <div className="w-full sm:w-64">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-red-500 focus:outline-none"
                  style={{ backgroundColor: "#2A2C2C" }}
                />
              </div>

              <button
                onClick={handleEmailSubmit}
                className="clickable w-full rounded-lg bg-red-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-red-700 sm:w-auto"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="flex w-full flex-col gap-3 sm:mx-auto sm:max-w-3xl sm:items-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-white">
              <span>E-posta: {formData.email}</span>
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-3 sm:gap-3">
              <input
                type="text"
                placeholder="Ad"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full rounded border border-gray-600 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-red-500 focus:outline-none"
                style={{ backgroundColor: "#2A2C2C" }}
              />
              <input
                type="text"
                placeholder="Soyad"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full rounded border border-gray-600 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-red-500 focus:outline-none"
                style={{ backgroundColor: "#2A2C2C" }}
              />
              <input
                type="text"
                placeholder="Meslek (opsiyonel)"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full rounded border border-gray-600 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-red-500 focus:outline-none"
                style={{ backgroundColor: "#2A2C2C" }}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={handleBackToEmail}
                className="clickable w-full rounded-lg bg-gray-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 sm:w-auto"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="clickable w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {status === "loading" ? "Kaydediliyor..." : "Abone Ol"}
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="text-center sm:text-left">
            <p className={`text-xs font-medium ${status === "error" ? "text-red-400" : "text-green-400"}`}>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
