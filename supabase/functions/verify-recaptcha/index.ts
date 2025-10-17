import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecaptchaResponse {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token, action } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA token is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Development mode için geçici token'ları kabul et
    if (token.startsWith('dev-token-')) {
      console.log('🏠 Development mode: Accepting dev token')
      return new Response(
        JSON.stringify({ 
          success: true, 
          score: 0.9,
          action: action || 'submit',
          hostname: 'localhost',
          devMode: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // reCAPTCHA v3 verification
    const recaptchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY')
    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const formData = new FormData()
    formData.append('secret', recaptchaSecret)
    formData.append('response', token)
    formData.append('remoteip', req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '')

    const recaptchaResponse = await fetch(verificationUrl, {
      method: 'POST',
      body: formData,
    })

    const recaptchaResult: RecaptchaResponse = await recaptchaResponse.json()

    console.log('reCAPTCHA verification result:', {
      success: recaptchaResult.success,
      score: recaptchaResult.score,
      action: recaptchaResult.action,
      errors: recaptchaResult['error-codes']
    })

    // Check if verification was successful
    if (!recaptchaResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'reCAPTCHA verification failed',
          details: recaptchaResult['error-codes']
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check score threshold (0.5 is recommended minimum)
    const score = recaptchaResult.score || 0
    const minScore = 0.5

    if (score < minScore) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'reCAPTCHA score too low',
          score: score,
          threshold: minScore
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check action if provided
    if (action && recaptchaResult.action !== action) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'reCAPTCHA action mismatch',
          expected: action,
          received: recaptchaResult.action
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        score: score,
        action: recaptchaResult.action,
        hostname: recaptchaResult.hostname
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
