"use client"

import { useState, useEffect, forwardRef } from "react"
import type { InputHTMLAttributes } from "react"
import { createClient } from "../lib/supabase/client"
// Email service removed - using Edge Functions instead
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import styled from "styled-components"

// reCAPTCHA v3 types
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      enterprise: {
        ready: (callback: () => void) => void
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
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

function DigitalAnalysisForm() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  
  console.log('🎬 DigitalAnalysisForm component mounted')
  console.log('🔧 Environment check:', {
    hasRecaptchaKey: !!recaptchaSiteKey,
    recaptchaKey: recaptchaSiteKey ? `${recaptchaSiteKey.substring(0, 10)}...` : 'NOT SET',
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
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  // reCAPTCHA v3 script yükleme - Basitleştirilmiş
  useEffect(() => {
    console.log('🔄 useEffect triggered - Checking reCAPTCHA...')
    
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    console.log('🔑 Site Key:', siteKey ? `${siteKey.substring(0, 20)}...` : 'NOT SET')
    
    if (!siteKey) {
      console.error('❌ VITE_RECAPTCHA_SITE_KEY not configured')
      return
    }

    // Development mode için bypass
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🏠 Development mode: Skipping reCAPTCHA for localhost')
      setRecaptchaLoaded(true)
      return
    }

    // Studio subdomain için geçici development mode
    if (window.location.hostname === 'studio.teknolojimenajeri.com') {
      console.log('🏠 Development mode: Skipping reCAPTCHA for studio domain (temporary)')
      setRecaptchaLoaded(true)
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="recaptcha"]`)
    console.log('🔍 Existing script in HTML:', existingScript ? 'FOUND' : 'NOT FOUND')
    
    if (existingScript) {
      console.log('✅ reCAPTCHA script found in HTML')
      // Basit timeout ile bekle
      setTimeout(() => {
        if (window.grecaptcha) {
          console.log('✅ window.grecaptcha is available')
          setRecaptchaLoaded(true)
        } else {
          console.log('⚠️ grecaptcha still not available after timeout')
          setRecaptchaLoaded(true) // Yine de devam et
        }
      }, 2000)
      return
    }

    console.log('📥 Loading reCAPTCHA script dynamically...')
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('✅ reCAPTCHA script loaded successfully')
      setTimeout(() => {
        if (window.grecaptcha) {
          console.log('✅ window.grecaptcha is available')
          setRecaptchaLoaded(true)
        } else {
          console.log('⚠️ grecaptcha still not available after script load')
          setRecaptchaLoaded(true) // Yine de devam et
        }
      }, 1000)
    }
    script.onerror = (error) => {
      console.error('❌ reCAPTCHA script failed to load:', error)
      setRecaptchaLoaded(true) // Hata olsa bile devam et
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
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      
      console.log('🔍 reCAPTCHA check:', { 
        recaptchaLoaded, 
        grecaptcha: !!window.grecaptcha,
        grecaptchaReady: !!(window.grecaptcha && typeof window.grecaptcha.ready === 'function'),
        siteKey: siteKey ? 'SET' : 'NOT SET',
        currentDomain: window.location.hostname,
        currentUrl: window.location.href,
        isLocalhost
      })
      
      // Development ortamında reCAPTCHA'yı atla
      if (isLocalhost) {
        console.log('🏠 Development mode: Skipping reCAPTCHA for localhost')
        resolve('dev-token-' + Date.now())
        return
      }
      
      // Studio subdomain için geçici development mode (domain kayıt sorunu için)
      if (window.location.hostname === 'studio.teknolojimenajeri.com') {
        console.log('🏠 Development mode: Skipping reCAPTCHA for studio domain (temporary)')
        resolve('dev-token-' + Date.now())
        return
      }
      
      if (!siteKey) {
        console.error('❌ reCAPTCHA site key not configured')
        resolve(null)
        return
      }

      if (!window.grecaptcha || typeof window.grecaptcha.ready !== 'function') {
        console.error('❌ reCAPTCHA not loaded or ready function not available')
        console.error('🔍 Available grecaptcha methods:', window.grecaptcha ? Object.keys(window.grecaptcha) : 'grecaptcha not available')
        resolve(null)
        return
      }

      try {
        // Enterprise API kullan - Görseldeki format'a uygun
        if (window.grecaptcha.enterprise) {
          window.grecaptcha.enterprise.ready(() => {
            console.log('🔍 reCAPTCHA Enterprise ready, executing...')
            // Görseldeki örnekteki gibi action parametresi
            window.grecaptcha.enterprise.execute(siteKey, { action: 'SUBMIT' })
              .then((token: string) => {
                console.log('✅ reCAPTCHA Enterprise token received:', token ? 'YES' : 'NO')
                console.log('📝 Token will be sent to backend for verification')
                resolve(token)
              })
              .catch((error) => {
                console.error('❌ reCAPTCHA Enterprise error:', error)
                resolve(null)
              })
          })
        } else {
          // Fallback to regular API
          window.grecaptcha.ready(() => {
            console.log('🔍 reCAPTCHA ready, executing...')
            window.grecaptcha.execute(siteKey, { action: 'SUBMIT' })
              .then((token: string) => {
                console.log('✅ reCAPTCHA token received:', token ? 'YES' : 'NO')
                console.log('📝 Token will be sent to backend for verification')
                resolve(token)
              })
              .catch((error) => {
                console.error('❌ reCAPTCHA error:', error)
                resolve(null)
              })
          })
        }
      } catch (error) {
        console.error('❌ reCAPTCHA ready error:', error)
        resolve(null)
      }
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
        const matchingWebsite = allWebsiteRequests.find((req: { website: string }) => 
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
        console.error('🔍 reCAPTCHA debug info:', {
          recaptchaLoaded,
          grecaptcha: !!window.grecaptcha,
          siteKey: recaptchaSiteKey ? `${recaptchaSiteKey.substring(0, 10)}...` : 'NOT SET',
          currentDomain: window.location.hostname,
          currentUrl: window.location.href
        })
        setFormState({ 
          status: 'error', 
          message: 'Güvenlik doğrulaması başarısız. Lütfen sayfayı yenileyin ve tekrar deneyin.' 
        })
        return
      }
      
      console.log('✅ reCAPTCHA token obtained, verifying with backend...')
      
      // Backend reCAPTCHA doğrulama
      const supabase = createClient()
      const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-recaptcha', {
        body: {
          token: token,
          action: 'SUBMIT'
        }
      })
      
      if (verificationError || !verificationResult?.success) {
        console.error('❌ reCAPTCHA backend verification failed:', verificationError || verificationResult)
        setFormState({ 
          status: 'error', 
          message: 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.' 
        })
        return
      }
      
      console.log('✅ reCAPTCHA backend verification successful, proceeding with submission...')
      
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
        <div className="grid gap-6 md:grid-cols-2">
          <BrutalistInput
            type="text"
            name="name"
            placeholder="Ad - Soyad"
            label="Ad - Soyad"
            value={formData.name}
            onChange={handleInputChange}
            disabled={formState.status === 'loading'}
            required
          />
          <BrutalistInput
            type="email"
            name="email"
            placeholder="E-posta"
            label="E-posta"
            value={formData.email}
            onChange={handleInputChange}
            disabled={formState.status === 'loading'}
            required
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <BrutalistInput
            type="text"
            name="website"
            placeholder="example.com"
            label="Website"
            value={formData.website}
            onChange={handleInputChange}
            onBlur={handleWebsiteBlur}
            disabled={formState.status === 'loading'}
            required
            className="flex-1"
          />
          <RaporButtonWrapper>
            <button
              type="submit"
              disabled={formState.status === 'loading'}
              className="rapor-button"
            >
              <span className="rapor-button__content">
                {formState.status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="rapor-button__text">Gönderiliyor...</span>
                  </>
                ) : (
                  <span className="rapor-button__text">RAPORUMU VER</span>
                )}
              </span>
            </button>
          </RaporButtonWrapper>
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

      </form>
    </div>
  )
}

export default DigitalAnalysisForm;

interface BrutalistInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  className?: string
}

const BrutalistInput = forwardRef<HTMLInputElement, BrutalistInputProps>(({ label, className, disabled, ...rest }, ref) => {
  return (
    <BrutalistField className={className} data-disabled={disabled ? "true" : "false"}>
      <div className={`brutalist-container${disabled ? " is-disabled" : ""}`}>
        <input ref={ref} disabled={disabled} className="brutalist-input smooth-type" {...rest} />
        <label className="brutalist-label">{label}</label>
      </div>
    </BrutalistField>
  )
})

BrutalistInput.displayName = "BrutalistInput"

const RaporButtonWrapper = styled.div`
  .rapor-button {
    width: 150px;
    padding: 0;
    border: none;
    transform: rotate(5deg) scale(0.78);
    transform-origin: center;
    font-family: "Gochi Hand", cursive;
    text-decoration: none;
    font-size: 15px;
    cursor: pointer;
    padding-bottom: 3px;
    border-radius: 5px;
    box-shadow: 0 2px 0 rgba(15, 23, 42, 0.55);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    display: inline-block;
  }

  .rapor-button__content {
    background: var(--color-primary-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    font-weight: 600;
  }

  .rapor-button__text {
    display: inline-block;
  }

  .rapor-button:active:not(:disabled) {
    transform: rotate(5deg) scale(0.78) translateY(5px);
    padding-bottom: 0px;
    outline: 0;
  }

  .rapor-button:disabled {
    cursor: not-allowed;
    box-shadow: 0 2px 0 rgba(15, 23, 42, 0.3);
    opacity: 0.7;
  }

  .rapor-button:disabled .rapor-button__content {
    opacity: 0.9;
  }
`

const BrutalistField = styled.div`
  position: relative;
  width: 100%;

  .brutalist-container {
    position: relative;
    width: 100%;
    font-family: "Space Mono", "Courier New", Courier, monospace;
    max-width: 100%;
  }

  .brutalist-input {
    width: 100%;
    padding: 12px 14px;
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    background-color: #ffffff;
    border: 3px solid #0f172a;
    border-radius: 0;
    outline: none;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 4px 4px 0 #0f172a, 9px 9px 0 rgba(244, 114, 182, 0.8);
    position: relative;
    overflow: hidden;
  }

  .brutalist-input:disabled {
    color: #94a3b8;
    background-color: #f8fafc;
    border-color: #cbd5f5;
    box-shadow: 4px 4px 0 #94a3b8, 9px 9px 0 rgba(226, 232, 240, 0.9);
    cursor: not-allowed;
  }

  .brutalist-input::placeholder {
    color: #64748b;
    transition: color 0.3s ease;
  }

  .brutalist-input:focus::placeholder {
    color: transparent;
  }

  .brutalist-input:focus {
    border-color: #f43f5e;
    box-shadow: 6px 6px 0 #0f172a, 12px 12px 0 rgba(251, 191, 36, 0.85);
  }

  .smooth-type {
    position: relative;
    overflow: hidden;
  }

  .smooth-type::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .smooth-type:focus::before {
    opacity: 1;
    animation: type-gradient 2s linear infinite;
  }

  .brutalist-label {
    position: absolute;
    left: -3px;
    top: -26px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: #ffffff;
    background-color: #0f172a;
    padding: 4px 10px;
    transform: rotate(-1.5deg);
    z-index: 2;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    text-transform: uppercase;
  }

  .brutalist-input:focus + .brutalist-label {
    transform: rotate(0deg) scale(1.05);
    background-color: #f43f5e;
    box-shadow: 3px 3px 0 rgba(251, 191, 36, 0.95);
  }

  .brutalist-container.is-disabled .brutalist-label {
    background-color: #cbd5f5;
    color: #475569;
    box-shadow: none;
  }

  .brutalist-input:focus::after {
    content: "";
    position: absolute;
    inset: -2px;
    background: #ffffff;
    z-index: -2;
  }

  @keyframes type-gradient {
    0% {
      background-position: 300px 0;
    }
    100% {
      background-position: 0 0;
    }
  }

  @media (max-width: 768px) {
    .brutalist-label {
      font-size: 9px;
      top: -24px;
    }
  }
`
