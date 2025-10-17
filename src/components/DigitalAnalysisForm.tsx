"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "../lib/supabase/client"
// Email service removed - using Edge Functions instead
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// reCAPTCHA v3 types
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

export function DigitalAnalysisForm() {
  console.log('🎬 DigitalAnalysisForm component mounted')
  console.log('🔧 Environment check:', {
    hasRecaptchaKey: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
  })
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    website: ''
  })
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: ''
  })
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  // reCAPTCHA v3 script yükleme
  useEffect(() => {
    console.log('🔄 useEffect triggered - Loading reCAPTCHA...')
    
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    console.log('🔑 Site Key:', siteKey ? `${siteKey.substring(0, 20)}...` : 'NOT SET')
    
    if (!siteKey) {
      console.error('❌ VITE_RECAPTCHA_SITE_KEY not configured')
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="recaptcha"]`)
    console.log('🔍 Existing script:', existingScript ? 'FOUND' : 'NOT FOUND')
    
    if (existingScript) {
      console.log('✅ reCAPTCHA script already loaded')
      setRecaptchaLoaded(true)
      
      // Check if grecaptcha is available
      if (window.grecaptcha) {
        console.log('✅ window.grecaptcha is available')
      } else {
        console.warn('⚠️ Script exists but grecaptcha not ready, waiting...')
        setTimeout(() => {
          if (window.grecaptcha) {
            console.log('✅ window.grecaptcha now available')
            setRecaptchaLoaded(true)
          }
        }, 1000)
      }
      return
    }

    console.log('📥 Loading reCAPTCHA script...')
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('✅ reCAPTCHA script loaded successfully')
      setRecaptchaLoaded(true)
      
      // Wait a bit for grecaptcha to be ready
      setTimeout(() => {
        console.log('🔍 grecaptcha available:', !!window.grecaptcha)
      }, 500)
    }
    script.onerror = (error) => {
      console.error('❌ reCAPTCHA script failed to load:', error)
      alert('reCAPTCHA yüklenemedi. İnternet bağlantınızı kontrol edin.')
    }
    
    console.log('➕ Appending script to head...')
    document.head.appendChild(script)

    return () => {
      console.log('🧹 Component unmounting (script stays)')
    }
  }, [])

  // reCAPTCHA v3 token alma
  const getRecaptchaToken = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
      
      console.log('🔍 reCAPTCHA check:', { 
        recaptchaLoaded, 
        grecaptcha: !!window.grecaptcha,
        siteKey: siteKey ? 'SET' : 'NOT SET'
      })
      
      if (!siteKey) {
        console.error('❌ reCAPTCHA site key not configured')
        resolve(null)
        return
      }

      if (!window.grecaptcha) {
        console.error('❌ reCAPTCHA not loaded')
        // Wait for script to load
        setTimeout(() => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              window.grecaptcha.execute(siteKey, { action: 'submit' })
                .then((token: string) => {
                  console.log('✅ reCAPTCHA token received (delayed):', token ? 'YES' : 'NO')
                  resolve(token)
                })
                .catch((error) => {
                  console.error('❌ reCAPTCHA error:', error)
                  resolve(null)
                })
            })
          } else {
            console.error('❌ reCAPTCHA still not loaded after delay')
            resolve(null)
          }
        }, 1000)
        return
      }

      window.grecaptcha.ready(() => {
        console.log('🔍 reCAPTCHA ready, executing...')
        window.grecaptcha.execute(siteKey, { action: 'submit' })
          .then((token: string) => {
            console.log('✅ reCAPTCHA token received:', token ? 'YES' : 'NO')
            resolve(token)
          })
          .catch((error) => {
            console.error('❌ reCAPTCHA error:', error)
            resolve(null)
          })
      })
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleWebsiteBlur = () => {
    if (formData.website) {
      let formattedValue = formData.website.trim()
      
      // Eğer http:// veya https:// ile başlamıyorsa, https:// ekle
      if (formattedValue && !formattedValue.startsWith('http://') && !formattedValue.startsWith('https://')) {
        formattedValue = 'https://' + formattedValue
      }
      
      setFormData(prev => ({
        ...prev,
        website: formattedValue
      }))
    }
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
    
    // Website URL formatı kontrolü
    try {
      const url = new URL(formData.website)
      
      // Protokol kontrolü
      if (!url.protocol.startsWith('http')) {
        setFormState({ status: 'error', message: 'Geçerli bir website adresi giriniz (örn: https://example.com)' })
        return false
      }
      
      // Hostname kontrolü (domain olmalı)
      if (!url.hostname || url.hostname.length < 3) {
        setFormState({ status: 'error', message: 'Geçerli bir domain adresi giriniz (örn: example.com)' })
        return false
      }
      
      // Domain TLD kontrolü (nokta içermeli)
      if (!url.hostname.includes('.')) {
        setFormState({ status: 'error', message: 'Geçerli bir domain adresi giriniz (örn: example.com)' })
        return false
      }
      
      // IP adresi kontrolü (IP adresi kabul etme)
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
      if (ipPattern.test(url.hostname)) {
        setFormState({ status: 'error', message: 'IP adresi yerine domain adı kullanın (örn: example.com)' })
        return false
      }
      
      // TLD uzunluk kontrolü (en az 2 karakter)
      const tld = url.hostname.split('.').pop()
      if (!tld || tld.length < 2) {
        setFormState({ status: 'error', message: 'Geçerli bir domain uzantısı kullanın (örn: .com, .net)' })
        return false
      }
      
    } catch (error) {
      setFormState({ status: 'error', message: 'Geçerli bir website adresi giriniz (örn: https://example.com)' })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setFormState({ status: 'loading', message: 'Talebiniz gönderiliyor...' })

    // Check if email or website already exists in last 7 days
    try {
      const supabase = createClient()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      // Normalize website URL for comparison (remove protocol and trailing slash)
      const normalizeUrl = (url: string) => {
        return url.trim()
          .toLowerCase()
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/$/, '')
      }

      const normalizedWebsite = normalizeUrl(formData.website)

      // Check for email
      const { data: existingEmailRequest, error: emailCheckError } = await supabase
        .from('digital_analysis_requests')
        .select('id, created_at, email')
        .eq('email', formData.email.trim())
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)

      if (emailCheckError) {
        console.error('Email check error:', emailCheckError)
      }

      if (existingEmailRequest && existingEmailRequest.length > 0) {
        setFormState({ 
          status: 'error', 
          message: 'Bu e-posta adresi ile son 7 gün içerisinde zaten bir talep gönderilmiş. Lütfen farklı bir e-posta adresi kullanın veya 7 gün sonra tekrar deneyin.' 
        })
        return
      }

      // Check for website
      const { data: allWebsiteRequests, error: websiteCheckError } = await supabase
        .from('digital_analysis_requests')
        .select('id, created_at, website')
        .gte('created_at', sevenDaysAgo.toISOString())

      if (websiteCheckError) {
        console.error('Website check error:', websiteCheckError)
      }

      // Check if any website matches after normalization
      if (allWebsiteRequests && allWebsiteRequests.length > 0) {
        const matchingWebsite = allWebsiteRequests.find(req => 
          normalizeUrl(req.website) === normalizedWebsite
        )

        if (matchingWebsite) {
          setFormState({ 
            status: 'error', 
            message: 'Bu website için son 7 gün içerisinde zaten bir talep gönderilmiş. Lütfen farklı bir website kullanın veya 7 gün sonra tekrar deneyin.' 
          })
          return
        }
      }
    } catch (checkError) {
      console.error('Rate limit check error:', checkError)
      // Continue with submission if check fails
    }

    try {
      // reCAPTCHA v3 token al
      console.log('📝 Form submitting, getting reCAPTCHA token...')
      const token = await getRecaptchaToken()
      
      if (!token) {
        console.error('❌ reCAPTCHA token is null')
        setFormState({ 
          status: 'error', 
          message: 'Güvenlik doğrulaması başarısız. Lütfen sayfayı yenileyin ve tekrar deneyin.' 
        })
        return
      }
      
      console.log('✅ reCAPTCHA token obtained, proceeding with submission...')

      const supabase = createClient()
      
      // Get user IP and user agent
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      const userAgent = navigator.userAgent

      // Insert without authentication (anonymous)
      const { data, error } = await supabase
        .from('digital_analysis_requests')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          website: formData.website.trim(),
          ip_address: ipData.ip,
          user_agent: userAgent,
          recaptcha_token: token,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        setFormState({ 
          status: 'error', 
          message: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
        })
        return
      }

      // Send confirmation emails via Edge Function
      try {
        const emailData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          website: formData.website.trim(),
          requestId: data.id
        }

        // Send user confirmation email
        try {
          const userEmailResponse = await supabase.functions.invoke('send-email', {
            body: {
              type: 'user_confirmation',
              to: emailData.email,
              data: emailData
            }
          })
          
          console.log('User email response:', userEmailResponse)
          console.log('User email data:', userEmailResponse.data)
          
          if (userEmailResponse.error) {
            console.error('User email error:', userEmailResponse.error)
          }
          
          if (!userEmailResponse.data) {
            console.error('User email data is null')
          }
        } catch (userEmailError) {
          console.error('User email catch error:', userEmailError)
        }

        // Send admin notification email
        try {
          const adminEmailResponse = await supabase.functions.invoke('send-email', {
            body: {
              type: 'admin_notification',
              to: 'furkan@fixurelabs.dev,mucahit@fixurelabs.dev',
              data: emailData
            }
          })
          
          console.log('Admin email response:', adminEmailResponse)
          console.log('Admin email data:', adminEmailResponse.data)
          
          if (adminEmailResponse.error) {
            console.error('Admin email error:', adminEmailResponse.error)
          }
          
          if (!adminEmailResponse.data) {
            console.error('Admin email data is null')
          }
        } catch (adminEmailError) {
          console.error('Admin email catch error:', adminEmailError)
        }

        console.log('Emails sent successfully via Edge Function')
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the form submission if email fails
      }

      setFormState({ 
        status: 'success', 
        message: 'Talebiniz başarıyla alındı! Onay e-postası gönderildi.' 
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
              type="text"
              name="website"
              placeholder="example.com"
              value={formData.website}
              onChange={handleInputChange}
              onBlur={handleWebsiteBlur}
              disabled={formState.status === 'loading'}
              className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors disabled:opacity-50"
              required
            />
          </div>
        </div>

        {/* reCAPTCHA v3 - Görünmez, otomatik çalışır */}

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
          disabled={formState.status === 'loading'}
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
