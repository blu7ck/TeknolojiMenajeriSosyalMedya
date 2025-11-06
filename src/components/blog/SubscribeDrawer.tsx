"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { X, Send } from "lucide-react"

import { createClient } from "../../lib/supabase/client"

import { StyledSubscribeButton } from "./StyledSubscribeButton"

interface FormState {
  name: string
  email: string
  profession: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

const initialFormState: FormState = {
  name: "",
  email: "",
  profession: "",
}

export function SubscribeDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pulseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerPulse = useCallback(() => {
    setIsAnimating(true)
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current)
    }
    pulseTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 800)
  }, [])

  useEffect(() => {
    startDelayRef.current = setTimeout(() => {
      triggerPulse()
      pulseIntervalRef.current = setInterval(() => {
        triggerPulse()
      }, 15000)
    }, 3000)

    return () => {
      if (startDelayRef.current) {
        clearTimeout(startDelayRef.current)
      }
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current)
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [triggerPulse])

  const handleOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
    setStatus("idle")
    setErrorMessage(null)
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setStatus("idle")
    setErrorMessage(null)
    setSuccessMessage(null)
    setShowSuccess(false)
  }

  const handleClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(false)
    resetForm()
  }

  const nameParts = useMemo(() => {
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      return { firstName: "", lastName: "" }
    }

    const [firstName, ...rest] = trimmedName.split(/\s+/)
    return {
      firstName,
      lastName: rest.join(" "),
    }
  }, [formData.name])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "loading") return

    setStatus("loading")
    setErrorMessage(null)
    setSuccessMessage(null)

    const supabase = createClient()

    let shouldAutoClose = false

    try {
      const { firstName, lastName } = nameParts
      const trimmedEmail = formData.email.trim()
      const trimmedProfession = formData.profession.trim()

      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          first_name: firstName || null,
          last_name: lastName || null,
          profession: trimmedProfession || null,
          email: trimmedEmail,
        })
        .select()
        .single()

      if (error) {
        if (error.code === "23505") {
          setSuccessMessage("Bu e-posta adresi zaten abone! Teşekkürler.")
          setStatus("success")
          setShowSuccess(true)
          shouldAutoClose = true
        } else {
          setErrorMessage(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
          setStatus("error")
        }
      } else {
        try {
          await supabase.functions.invoke("send-welcome-email", {
            body: {
              email: trimmedEmail,
              firstName: firstName,
              lastName,
            },
          })
        } catch (welcomeError) {
          console.warn("Welcome email error:", welcomeError)
        }

        console.log("Newsletter abonelik başarılı:", data)
        setSuccessMessage("Başarıyla abone oldunuz! Hoş geldiniz.")
        setStatus("success")
        setShowSuccess(true)
        shouldAutoClose = true
      }
    } catch (error) {
      console.error("Newsletter abonelik hatası:", error)
      setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
      setStatus("error")
    } finally {
      if (shouldAutoClose) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current)
        }
        closeTimeoutRef.current = setTimeout(() => {
          handleClose()
        }, 2000)
      }
    }
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <StyledSubscribeButton isAnimating={isAnimating} onClick={handleOpen} />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full transform overflow-y-auto bg-transparent transition-all duration-500 ease-out sm:w-96 sm:rounded-l-3xl ${
          isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"
        }`}
        style={{
          background: isOpen
            ? "linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(25, 25, 30, 0.95) 100%)"
            : undefined,
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Bültene Katılarak</h2>
            <p className="mt-1 text-xs text-white/50">Haberdar kalın</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="group rounded-full p-2 transition-colors duration-200 hover:bg-white/10"
            aria-label="Bülten formunu kapat"
          >
            <X size={24} className="text-white/60 group-hover:text-white" />
          </button>
        </div>

        <div className="p-6">
          {showSuccess ? (
            <div className="flex animate-in fade-in flex-col items-center justify-center py-12 text-center duration-300">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mb-2 text-lg font-semibold text-white">Başarılı!</p>
              {successMessage && <p className="text-sm text-white/70">{successMessage}</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-white/80">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-all duration-200 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-white/80">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-all duration-200 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profession" className="block text-sm font-semibold text-white/80">
                  Meslek
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Opsiyonel"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-all duration-200 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-white font-semibold transition-all duration-200 hover:border-red-700 hover:bg-red-600 active:scale-95"
                disabled={status === "loading"}
              >
                <span>{status === "loading" ? "Gönderiliyor..." : "Abone Ol"}</span>
                <Send size={18} />
              </button>

              <p className="mt-4 text-center text-xs leading-relaxed text-white/50">
                Verileriniz yalnızca bülten gönderiminde kullanılacaktır.
              </p>

              {errorMessage && (
                <p className="text-center text-sm text-red-300">{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  )
}

