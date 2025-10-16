import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Deno } from "https://deno.land/std@0.168.0/io/mod.ts" // Declare Deno variable

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY")!
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN")!
const FROM_EMAIL = `Teknoloji Menajeri <noreply@${MAILGUN_DOMAIN}>`

serve(async (req) => {
  try {
    const { email, firstName, lastName, gender } = await req.json()

    // Determine salutation based on gender or default to "Sayın"
    const salutation =
      gender === "male"
        ? `${firstName} Bey`
        : gender === "female"
          ? `${lastName} Hanım`
          : `Sayın ${firstName} ${lastName}`

    // Mailgun template kullan
    const templateVariables = {
      isim: salutation
    }

    const formData = new FormData()
    formData.append("from", FROM_EMAIL)
    formData.append("to", email)
    formData.append("template", "welcome_corporate_tr")
    formData.append("subject", "Teknoloji Menajeri Blog'a Hoş Geldiniz!")
    
    // Template variables ekle
    Object.entries(templateVariables).forEach(([key, value]) => {
      formData.append(`v:${key}`, value)
    })

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Mailgun API error: ${response.statusText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
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
