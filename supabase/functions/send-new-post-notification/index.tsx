import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { env } from "https://deno.land/std@0.168.0/dotenv/mod.ts"

await env.load()

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY")!
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const FROM_EMAIL = `Teknoloji Menajeri <noreply@${MAILGUN_DOMAIN}>`

serve(async (req) => {
  try {
    const { postId } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch the blog post
    const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("id", postId).single()

    if (postError || !post) {
      throw new Error("Blog post not found")
    }

    // Fetch all active subscribers
    const { data: subscribers, error: subsError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("is_active", true)

    if (subsError || !subscribers) {
      throw new Error("Failed to fetch subscribers")
    }

    // Send email to each subscriber using Mailgun template
    const emailPromises = subscribers.map(async (subscriber) => {
      const templateVariables = {
        isim: `${subscriber.first_name} ${subscriber.last_name}`,
        baslik: post.title,
        ozet: post.excerpt || 'Yazının detaylarını okumak için tıklayın.',
        link: `https://teknolojimenajeri.com/blog/${post.slug}`
      }

      const formData = new FormData()
      formData.append("from", FROM_EMAIL)
      formData.append("to", subscriber.email)
      formData.append("template", "update_notification_tr")
      formData.append("subject", `Bu Ayın Özeti: ${post.title}`)
      
      // Template variables ekle
      Object.entries(templateVariables).forEach(([key, value]) => {
        formData.append(`v:${key}`, value)
      })

      return fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        },
        body: formData,
      })
    })

    await Promise.all(emailPromises)

    return new Response(JSON.stringify({ success: true, sent: subscribers.length }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
