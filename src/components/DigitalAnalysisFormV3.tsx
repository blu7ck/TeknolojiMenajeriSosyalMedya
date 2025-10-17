"use client"

import { useState, useEffect } from "react"
import { createClient } from "../lib/supabase/client"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// reCAPTCHA v3 için script yükleme
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

interface FormData {
  name: string
  email: string
  website: string
}

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export function DigitalAnalysisFormV3() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    website: ''
  })
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: ''
  })
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  // reCAPTCHA script yükleme
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setRecaptchaLoaded(true)
      })
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector(`script[src*="recaptcha"]`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormState({ status: 'error', message: 'Ad-Soyad alanı zorunludur' })
      return false
    }
    if (!formData.email.trim()) {
      setFormState({ status: 'error', message: 'E-posta alanı zorunludur' })
      return false
    }
    if (!formData.website.trim()) {
      setFormState({ status: 'error', message: 'Website alanı zorunludur' })
      return false
    }
    if (!recaptchaLoaded) {
      setFormState({ status: 'error', message: 'reCAPTCHA yükleniyor, lütfen bekleyin' })
      return false
    }
    return true
  }

  const executeRecaptcha = async (): Promise<string | null> => {
    try {
      const token = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: 'submit_form' }
      )
      return token
    } catch (error) {
      console.error('reCAPTCHA execution error:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setFormState({ status: 'loading', message: 'Talebiniz gönderiliyor...' })

    try {
      // reCAPTCHA token al
      const recaptchaToken = await executeRecaptcha()
      
      if (!recaptchaToken) {
        setFormState({ 
          status: 'error', 
          message: 'reCAPTCHA doğrulaması başarısız. Lütfen tekrar deneyin.' 
        })
        return
      }

      const supabase = createClient()
      
      // Get user IP and user agent
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      const userAgent = navigator.userAgent

      const { data, error } = await supabase
        .from('digital_analysis_requests')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          website: formData.website.trim(),
          ip_address: ipData.ip,
          user_agent: userAgent,
          recaptcha_token: recaptchaToken,
          status: 'pending'
        })

      if (error) {
        console.error('Database error:', error)
        setFormState({ 
          status: 'error', 
          message: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
        })
        return
      }

      setFormState({ 
        status: 'success', 
        message: 'Talebiniz başarıyla alındı! En kısa sürede size dönüş yapacağız.' 
      })
      
      // Reset form
      setFormData({ name: '', email: '', website: '' })

    } catch (error) {
      console.error('Submit error:', error)
      setFormState({ 
        status: 'error', 
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Ad - Soyad"
              value={formData.name}
              onChange={handleInputChange}
              disabled={formState.status === 'loading'}
              className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors disabled:opacity-50"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleInputChange}
              disabled={formState.status === 'loading'}
              className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors disabled:opacity-50"
              required
            />
          </div>
          <div>
            <input
              type="url"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleInputChange}
              disabled={formState.status === 'loading'}
              className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors disabled:opacity-50"
              required
            />
          </div>
        </div>

        {/* reCAPTCHA v3 - Görünmez */}
        {!recaptchaLoaded && (
          <div className="text-center text-sm text-gray-500">
            Güvenlik doğrulaması yükleniyor...
          </div>
        )}

        {/* Status Message */}
        {formState.message && (
          <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
            formState.status === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : formState.status === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {formState.status === 'success' && <CheckCircle className="w-5 h-5" />}
            {formState.status === 'error' && <AlertCircle className="w-5 h-5" />}
            {formState.status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{formState.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={formState.status === 'loading' || !recaptchaLoaded}
          className="w-full md:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 disabled:hover:scale-100"
        >
          {formState.status === 'loading' ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gönderiliyor...</span>
            </div>
          ) : (
            'Rapor İste'
          )}
        </button>
      </form>
    </div>
  )
}
