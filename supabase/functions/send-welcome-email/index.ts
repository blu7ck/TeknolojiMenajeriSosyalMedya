import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  console.log("=== EDGE FUNCTION STARTED ===")
  console.log("Request method:", req.method)
  console.log("Request URL:", req.url)
  
  // Test response - her zaman çalışsın
  console.log("=== TESTING BASIC FUNCTIONALITY ===")
  console.log("Environment test:", {
    hasApiKey: !!Deno.env.get("MAILGUN_API_KEY"),
    hasDomain: !!Deno.env.get("MAILGUN_DOMAIN"),
    hasBaseUrl: !!Deno.env.get("MAILGUN_BASE_URL")
  })
  
  // CORS preflight için OPTIONS request'i handle et
  if (req.method === "OPTIONS") {
    console.log("OPTIONS request - returning CORS headers")
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  try {
    console.log("Request body parsing başlıyor...")
    const body = await req.json()
    console.log("Request body:", body)
    
    const { email, firstName, lastName } = body
    console.log("Edge Function çağrıldı:", { email, firstName, lastName })

    // Environment variables kontrol et
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY")
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN")
    const MAILGUN_BASE_URL = Deno.env.get("MAILGUN_BASE_URL") || "https://api.eu.mailgun.net"

    console.log("Environment variables:", { 
      hasApiKey: !!MAILGUN_API_KEY, 
      hasDomain: !!MAILGUN_DOMAIN,
      hasBaseUrl: !!MAILGUN_BASE_URL,
      domain: MAILGUN_DOMAIN,
      baseUrl: MAILGUN_BASE_URL,
      apiKeyPrefix: MAILGUN_API_KEY ? MAILGUN_API_KEY.substring(0, 8) + "..." : "MISSING"
    })

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.log("❌ MAILGUN ENVIRONMENT VARIABLES EKSİK!")
      console.log("API Key exists:", !!MAILGUN_API_KEY)
      console.log("Domain exists:", !!MAILGUN_DOMAIN)
      console.log("Base URL exists:", !!MAILGUN_BASE_URL)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Environment variables eksik",
          debug: {
            hasApiKey: !!MAILGUN_API_KEY,
            hasDomain: !!MAILGUN_DOMAIN,
            hasBaseUrl: !!MAILGUN_BASE_URL,
            domain: MAILGUN_DOMAIN,
            baseUrl: MAILGUN_BASE_URL
          }
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          } 
        }
      )
    }

    const FROM_EMAIL = `Teknoloji Menajeri <email@${MAILGUN_DOMAIN}>`

    // Basit isim formatı
    const templateVariables = {
      isim: `${firstName} ${lastName}`
    }

    const formData = new FormData()
    formData.append("from", FROM_EMAIL)
    formData.append("to", email)
    formData.append("template", "welcome_corporate_tr")
    formData.append("subject", "Teknoloji Menajeri Blog'a Hoş Geldiniz!")

    // URL'yi düzgün oluştur
    const mailgunUrl = `${MAILGUN_BASE_URL}/v3/${MAILGUN_DOMAIN}/messages`
    
    console.log("Mailgun API çağrısı yapılıyor:", {
      baseUrl: MAILGUN_BASE_URL,
      domain: MAILGUN_DOMAIN,
      fullUrl: mailgunUrl,
      from: FROM_EMAIL,
      to: email,
      template: "welcome_corporate_tr",
      templateVariables: templateVariables,
      authHeader: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
    })

    console.log("Fetch request başlıyor...")
    
    // Header'ları düzgün oluştur
    const headers = new Headers()
    headers.set("Authorization", `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`)
    
    // Template variables'ı Mailgun formatında ekle
    formData.append("h:X-Mailgun-Variables", JSON.stringify(templateVariables))
    
    console.log("Form data contents:", Array.from(formData.entries()))
    
    const response = await fetch(mailgunUrl, {
      method: "POST",
      headers: headers,
      body: formData,
    })
    console.log("Fetch request tamamlandı")

    console.log("Mailgun API response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Mailgun API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        url: `${MAILGUN_BASE_URL}/v3/${MAILGUN_DOMAIN}/messages`,
        headers: Object.fromEntries(response.headers.entries())
      })
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email gönderilemedi", 
          details: errorText,
          status: response.status,
          url: `${MAILGUN_BASE_URL}/v3/${MAILGUN_DOMAIN}/messages`
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          } 
        }
      )
    }

    const result = await response.json()
    console.log("Welcome email sent successfully:", result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email başarıyla gönderildi",
        mailgunId: result.id 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        } 
      }
    )
  } catch (error) {
    console.error("Welcome email error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Welcome email gönderilemedi", 
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        } 
      }
    )
  }
})