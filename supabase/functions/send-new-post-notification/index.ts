import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // CORS preflight için OPTIONS request'i handle et
  if (req.method === "OPTIONS") {
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
    const { postId } = await req.json()

    // Environment variables kontrol et
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY")
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN")
    const MAILGUN_BASE_URL = Deno.env.get("MAILGUN_BASE_URL") || "https://api.eu.mailgun.net"
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Environment variables eksik, email gönderilmedi")
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Environment variables eksik, email gönderilmedi",
          skipped: true
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

    // Supabase client oluştur
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Blog post'u al
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", postId)
      .single()

    if (postError || !post) {
      throw new Error("Blog post bulunamadı")
    }

    // Anahtar kelime kontrolü - sadece "ŞİMDİLERDE NELER OLUYOR?" başlıklı yazılar için email gönder
    const isMonthlySummary = post.title.includes("ŞİMDİLERDE NELER OLUYOR?")
    if (!isMonthlySummary) {
      console.log("❌ Anahtar kelime yok, email gönderilmiyor:", post.title)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Anahtar kelime bulunamadı, email gönderilmedi",
          skipped: true,
          postTitle: post.title
        }),
        {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 200,
        }
      )
    }

    console.log("✅ Anahtar kelime bulundu, email gönderiliyor:", post.title)

    // Aktif aboneleri al
    const { data: subscribers, error: subscribersError } = await supabase
      .from("newsletter_subscribers")
      .select("email, first_name, last_name")
      .eq("is_active", true)

    if (subscribersError || !subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Aktif abone bulunamadı" 
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

    // Dinamik email başlığı oluştur
    const currentMonth = new Date().toLocaleDateString("tr-TR", { 
      month: "long", 
      year: "numeric" 
    })
    const emailSubject = `ŞİMDİLERDE NELER OLUYOR? | ${currentMonth} ÖZETİ`

    console.log("📧 Email başlığı:", emailSubject)

    // Her aboneye email gönder
    const emailPromises = subscribers.map(async (subscriber) => {
      const templateVariables = {
        isim: `${subscriber.first_name} ${subscriber.last_name}`,
        baslik: post.title || "ŞİMDİLERDE NELER OLUYOR?",
        ozet: post.excerpt || 'Bu ayın teknoloji özetini okumak için tıklayın.',
        link: `https://teknolojimenajeri.com/blog/${post.slug}`,
        icerik: post.content || 'İçerik bulunamadı.',
        gorsel: post.cover_image || 'https://i.ibb.co/CstJSnMp/logo.png'
      }

      const formData = new FormData()
      formData.append("from", FROM_EMAIL)
      formData.append("to", subscriber.email)
      formData.append("template", "update_notification_tr")
      formData.append("subject", emailSubject)

      // Header'ları düzgün oluştur
      const headers = new Headers()
      headers.set("Authorization", `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`)
      
      // Template variables'ı Mailgun formatında ekle (v: formatı)
      Object.entries(templateVariables).forEach(([key, value]) => {
        formData.append(`v:${key}`, value)
      })

      // URL'yi düzgün oluştur
      const mailgunUrl = `${MAILGUN_BASE_URL}/v3/${MAILGUN_DOMAIN}/messages`
      
      return fetch(mailgunUrl, {
        method: "POST",
        headers: headers,
        body: formData,
      })
    })

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter(result => result.status === 'fulfilled').length

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${successful}/${subscribers.length} email başarıyla gönderildi`,
        sent: successful,
        total: subscribers.length
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
    console.error("New post notification error:", error)
    return new Response(
      JSON.stringify({ 
        success: true, 
        error: "Email gönderilemedi", 
        details: error.message,
        skipped: true
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
})