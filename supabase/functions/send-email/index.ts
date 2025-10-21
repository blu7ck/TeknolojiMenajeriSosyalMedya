import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'user_confirmation' | 'admin_notification' | 'status_update' | 'feedback_request' | 'analysis_report' | 'package_request'
  to: string
  data: {
    name: string
    email: string
    website: string
    requestId: string
    status?: string
    reason?: string
    report_summary?: any
    markdown_report?: string
    pdf_url?: string
  }
}

serve(async (req) => {
  console.log('🚀 Edge Function started')
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Request received:', req.method, req.url)
    
    const { type, to, data }: EmailRequest = await req.json()
    console.log('📧 Email request data:', { type, to, data })

    console.log(`📧 Sending ${type} email to: ${to}`)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('🔧 Supabase config:', { 
      url: supabaseUrl ? 'SET' : 'NOT SET', 
      key: supabaseKey ? 'SET' : 'NOT SET' 
    })
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate email content based on type
    const emailContent = generateEmailContent(type, data)

    // Send email via Mailgun
    const emailSent = await sendEmailViaMailgun(emailContent)

    if (emailSent) {
      console.log(`✅ ${type} email sent successfully to ${to}`)
      
      // Update database if needed
      if (type === 'user_confirmation') {
        await supabase
          .from('digital_analysis_requests')
          .update({ 
            feedback_sent_at: new Date().toISOString() 
          })
          .eq('id', data.requestId)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          type: type,
          to: to
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      console.error(`❌ Failed to send ${type} email to ${to}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email',
          type: type,
          to: to
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

  } catch (error) {
    console.error('❌ Email error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Generate email content based on type
function generateEmailContent(type: string, data: any) {
  const baseUrl = 'https://studio.teknolojimenajeri.com'
  
  switch (type) {
    case 'user_confirmation':
      return {
        to: data.email,
        subject: 'Dijital Analiz Talebiniz Alındı - Teknoloji Menajeri',
        html: generateUserConfirmationHTML(data, baseUrl),
        text: generateUserConfirmationText(data)
      }
    
    case 'admin_notification':
      return {
        to: 'furkan@fixurelabs.dev,mucahit@fixurelabs.dev',
        subject: 'Yeni Dijital Analiz Talebi - Admin Paneli',
        html: generateAdminNotificationHTML(data, baseUrl),
        text: generateAdminNotificationText(data)
      }
    
    case 'status_update':
      return {
        to: data.email,
        subject: getStatusSubject(data.status),
        html: generateStatusUpdateHTML(data, baseUrl),
        text: generateStatusUpdateText(data)
      }
    
    case 'analysis_report':
      return {
        to: data.email,
        subject: `Dijital Analiz Raporunuz Hazır - ${data.website}`,
        html: generateAnalysisReportHTML(data, baseUrl),
        text: generateAnalysisReportText(data)
      }
    
    case 'package_request':
      return {
        to: 'furkan@fixurelabs.dev,mucahit@fixurelabs.dev',
        subject: `Yeni Paket Talebi - ${data.formData.firstName} ${data.formData.lastName}`,
        html: generatePackageRequestHTML(data, baseUrl),
        text: generatePackageRequestText(data)
      }
    
    default:
      throw new Error(`Unknown email type: ${type}`)
  }
}

// Send email via Mailgun
async function sendEmailViaMailgun(emailContent: any): Promise<boolean> {
  try {
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN')
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY')
    const mailgunBaseUrl = Deno.env.get('MAILGUN_BASE_URL') || 'https://api.eu.mailgun.net'
    
    console.log('🔧 Mailgun config:', { 
      domain: mailgunDomain ? 'SET' : 'NOT SET', 
      apiKey: mailgunApiKey ? 'SET' : 'NOT SET',
      baseUrl: mailgunBaseUrl
    })
    
    if (!mailgunDomain || !mailgunApiKey) {
      console.warn('❌ Mailgun credentials not configured')
      return false
    }

    const formData = new FormData()
    formData.append('from', `Teknoloji Menajeri <info@${mailgunDomain}>`)
    formData.append('to', emailContent.to)
    formData.append('subject', emailContent.subject)
    formData.append('html', emailContent.html)
    if (emailContent.text) {
      formData.append('text', emailContent.text)
    }

    // URL'yi düzgün oluştur
    const mailgunUrl = `${mailgunBaseUrl}/v3/${mailgunDomain}/messages`
    
    console.log('📤 Sending to Mailgun API:', {
      url: mailgunUrl,
      from: `Teknoloji Menajeri <info@${mailgunDomain}>`,
      to: emailContent.to,
      subject: emailContent.subject
    })
    
    // Header'ları düzgün oluştur
    const headers = new Headers()
    headers.set('Authorization', `Basic ${btoa(`api:${mailgunApiKey}`)}`)
    
    const response = await fetch(mailgunUrl, {
      method: 'POST',
      headers: headers,
      body: formData
    })

    console.log('📤 Mailgun response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Mailgun API error:', errorText)
      return false
    }
    
    console.log('✅ Mailgun API success')

    return true
  } catch (error) {
    console.error('Mailgun send error:', error)
    return false
  }
}

// Email Templates
function generateUserConfirmationHTML(data: any, baseUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Dijital Analiz Talebiniz Alındı</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Merhaba <strong>${data.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dijital analiz talebiniz başarıyla alınmıştır. Ekibimiz en kısa sürede 
          <strong>${data.website}</strong> adresini analiz ederek size detaylı bir rapor sunacaktır.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">Talep Detayları:</h3>
          <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>E-posta:</strong> ${data.email}</p>
          <p style="margin: 5px 0;"><strong>Website:</strong> <a href="${data.website}" style="color: #667eea;">${data.website}</a></p>
          <p style="margin: 5px 0;"><strong>Talep ID:</strong> ${data.requestId}</p>
        </div>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Analiz süreci genellikle 24-48 saat içinde tamamlanır. Raporunuz hazır olduğunda 
          size e-posta ile bildirim göndereceğiz.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Web Sitemizi Ziyaret Edin
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
        </p>
      </div>
    </div>
  `
}

function generateUserConfirmationText(data: any) {
  return `
    Dijital Analiz Talebiniz Alındı - Teknoloji Menajeri
    
    Merhaba ${data.name},
    
    Dijital analiz talebiniz başarıyla alınmıştır. Ekibimiz en kısa sürede 
    ${data.website} adresini analiz ederek size detaylı bir rapor sunacaktır.
    
    Talep Detayları:
    - Ad Soyad: ${data.name}
    - E-posta: ${data.email}
    - Website: ${data.website}
    - Talep ID: ${data.requestId}
    
    Analiz süreci genellikle 24-48 saat içinde tamamlanır.
    
    Teknoloji Menajeri Ekibi
  `
}

function generateAdminNotificationHTML(data: any, baseUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Yeni Dijital Analiz Talebi</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Admin paneline yeni bir dijital analiz talebi eklendi.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
          <h3 style="color: #333; margin-top: 0;">Talep Detayları:</h3>
          <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>E-posta:</strong> ${data.email}</p>
          <p style="margin: 5px 0;"><strong>Website:</strong> <a href="${data.website}" style="color: #ff6b6b;">${data.website}</a></p>
          <p style="margin: 5px 0;"><strong>Talep ID:</strong> ${data.requestId}</p>
          <p style="margin: 5px 0;"><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/blu4ck" 
             style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Admin Paneline Git
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir.
        </p>
      </div>
    </div>
  `
}

function generateAdminNotificationText(data: any) {
  return `
    Yeni Dijital Analiz Talebi - Admin Paneli
    
    Admin paneline yeni bir dijital analiz talebi eklendi.
    
    Talep Detayları:
    - Ad Soyad: ${data.name}
    - E-posta: ${data.email}
    - Website: ${data.website}
    - Talep ID: ${data.requestId}
    - Tarih: ${new Date().toLocaleString('tr-TR')}
    
    Admin paneline giriş yaparak talebi onaylayabilirsiniz.
  `
}

function getStatusSubject(status: string) {
  const statusMessages = {
    approved: 'Dijital Analiz Talebiniz Onaylandı',
    processing: 'Dijital Analiz İşleme Alındı',
    completed: 'Dijital Analiz Raporunuz Hazır',
    rejected: 'Dijital Analiz Talebi Reddedildi'
  }
  return statusMessages[status as keyof typeof statusMessages] || 'Dijital Analiz Durum Güncellemesi'
}

function generateStatusUpdateHTML(data: any, baseUrl: string) {
  const statusMessages = {
    approved: 'Talebiniz onaylanmıştır. Analiz süreci başlamıştır.',
    processing: 'Analiz süreci başlamıştır. Raporunuz hazırlanıyor.',
    completed: 'Analiz raporunuz hazırlanmıştır. Raporu e-posta ekinde bulabilirsiniz.',
    rejected: 'Maalesef talebiniz reddedilmiştir. Detaylar için bizimle iletişime geçebilirsiniz.'
  }
  
  const message = statusMessages[data.status as keyof typeof statusMessages] || 'Talebinizin durumu güncellenmiştir.'
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${getStatusSubject(data.status)}</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Merhaba <strong>${data.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          ${message}
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">Talep Detayları:</h3>
          <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>Website:</strong> <a href="${data.website}" style="color: #667eea;">${data.website}</a></p>
          <p style="margin: 5px 0;"><strong>Talep ID:</strong> ${data.requestId}</p>
          <p style="margin: 5px 0;"><strong>Durum:</strong> ${data.status}</p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
        </p>
      </div>
    </div>
  `
}

function generateStatusUpdateText(data: any) {
  const statusMessages = {
    approved: 'Talebiniz onaylanmıştır. Analiz süreci başlamıştır.',
    processing: 'Analiz süreci başlamıştır. Raporunuz hazırlanıyor.',
    completed: 'Analiz raporunuz hazırlanmıştır. Raporu e-posta ekinde bulabilirsiniz.',
    rejected: 'Maalesef talebiniz reddedilmiştir. Detaylar için bizimle iletişime geçebilirsiniz.'
  }
  
  const message = statusMessages[data.status as keyof typeof statusMessages] || 'Talebinizin durumu güncellenmiştir.'
  
  return `
    ${getStatusSubject(data.status)}
    
    Merhaba ${data.name},
    
    ${message}
    
    Talep Detayları:
    - Ad Soyad: ${data.name}
    - Website: ${data.website}
    - Talep ID: ${data.requestId}
    - Durum: ${data.status}
    
    Teknoloji Menajeri Ekibi
  `
}

function generateFeedbackRequestHTML(data: any, baseUrl: string) {
  const feedbackUrl = `${baseUrl}/feedback?id=${data.requestId}`
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Görüşlerinizi Paylaşın</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Merhaba <strong>${data.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dijital analiz raporunuzu aldığınızdan bu yana bir hafta geçti. 
          Hizmetimiz hakkındaki görüşlerinizi paylaşarak bize yardımcı olabilir misiniz?
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">Neden Feedback İstiyoruz?</h3>
          <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
            <li>Hizmet kalitemizi sürekli geliştirmek için</li>
            <li>Müşteri deneyimini iyileştirmek için</li>
            <li>Size daha iyi hizmet verebilmek için</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${feedbackUrl}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Feedback Formunu Doldurun
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
        </p>
      </div>
    </div>
  `
}

// Analysis Report Email Templates
function generateAnalysisReportHTML(data: any, baseUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #DC2626; }
        .score { font-size: 48px; font-weight: bold; color: #DC2626; }
        .button { display: inline-block; background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Dijital Analiz Raporunuz Hazır!</h1>
        </div>
        <div class="content">
          <p>Merhaba <strong>${data.name}</strong>,</p>
          
          <p><strong>${data.website}</strong> website'iniz için hazırladığımız dijital analiz raporu tamamlandı!</p>
          
          <div class="score-card">
            <h2>Genel Değerlendirme</h2>
            <div class="score">${data.report_summary?.overall_score || 0}/100</div>
            <p><strong>Güçlü Yönler:</strong></p>
            <ul>
              ${(data.report_summary?.strengths || []).map((s: string) => `<li>✅ ${s}</li>`).join('')}
            </ul>
            ${(data.report_summary?.improvements || []).length > 0 ? `
              <p><strong>Geliştirilmesi Gerekenler:</strong></p>
              <ul>
                ${data.report_summary.improvements.map((i: string) => `<li>⚠️ ${i}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
          
          ${data.pdf_url ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.pdf_url}" class="button" style="background: #DC2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                📄 Ayrıntılı Sonuçlarınız İçin: Detaylı Raporu Görüntüle
              </a>
            </div>
          ` : ''}
          
          <p style="margin-top: 30px;">Bu rapor hakkında sorularınız veya danışmanlık talebiniz için bizimle iletişime geçebilirsiniz.</p>
          
          <div class="footer">
            <p>Bu rapor <strong>Teknoloji Menajeri</strong> tarafından otomatik olarak oluşturulmuştur.</p>
            <p>E-posta: gulsah@teknolojimenajeri.com</p>
            <p>Website: <a href="https://www.teknolojimenajeri.com.tr">www.teknolojimenajeri.com.tr</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateAnalysisReportText(data: any) {
  return `
    Dijital Analiz Raporunuz Hazır!
    
    Merhaba ${data.name},
    
    ${data.website} website'iniz için hazırladığımız dijital analiz raporu tamamlandı!
    
    GENEL DEĞERLENDİRME
    Toplam Skor: ${data.report_summary?.overall_score || 0}/100
    
    ${data.markdown_report || 'Rapor oluşturulamadı'}
    
    Bu rapor hakkında sorularınız için:
    E-posta: gulsah@teknolojimenajeri.com
    Website: https://studio.teknolojimenajeri.com
    
    Teknoloji Menajeri
  `
}

// Package Request Email Templates
function generatePackageRequestHTML(data: any, baseUrl: string) {
  const socialMediaList = data.formData.socialMedia
    .filter((social: any) => social.username.trim())
    .map((social: any) => {
      const platformNames: any = {
        instagram: 'Instagram',
        tiktok: 'TikTok', 
        facebook: 'Facebook',
        linkedin: 'LinkedIn',
        twitter: 'X (Twitter)'
      }
      return `${platformNames[social.platform] || social.platform}: @${social.username}`
    })
    .join('<br>')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #DC2626 0%, #000000 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Yeni Paket Talebi</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
          <h2 style="color: #DC2626; margin: 0 0 15px 0;">📦 Paket Bilgileri</h2>
          <p style="margin: 5px 0;"><strong>Paket:</strong> ${data.package}</p>
          <p style="margin: 5px 0;"><strong>Seçili Modüller:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${data.modules.map((module: string) => `<li>${module}</li>`).join('')}
          </ul>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
          <h2 style="color: #DC2626; margin: 0 0 15px 0;">👤 Müşteri Bilgileri</h2>
          <p style="margin: 5px 0;"><strong>İsim:</strong> ${data.formData.firstName} ${data.formData.lastName}</p>
          <p style="margin: 5px 0;"><strong>E-posta:</strong> <a href="mailto:${data.formData.email}" style="color: #DC2626;">${data.formData.email}</a></p>
          <p style="margin: 5px 0;"><strong>Telefon:</strong> <a href="tel:${data.formData.phone}" style="color: #DC2626;">${data.formData.phone}</a></p>
          ${data.formData.companyInfo ? `<p style="margin: 5px 0;"><strong>Kurumsal Bilgi:</strong><br>${data.formData.companyInfo}</p>` : ''}
        </div>
        
        ${socialMediaList ? `
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
          <h2 style="color: #DC2626; margin: 0 0 15px 0;">📱 Sosyal Medya Hesapları</h2>
          <p style="margin: 0;">${socialMediaList}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/blu4ck" 
             style="background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Admin Paneline Git
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir.
        </p>
      </div>
    </div>
  `
}

function generatePackageRequestText(data: any) {
  const socialMediaList = data.formData.socialMedia
    .filter((social: any) => social.username.trim())
    .map((social: any) => {
      const platformNames: any = {
        instagram: 'Instagram',
        tiktok: 'TikTok',
        facebook: 'Facebook', 
        linkedin: 'LinkedIn',
        twitter: 'X (Twitter)'
      }
      return `${platformNames[social.platform] || social.platform}: @${social.username}`
    })
    .join('\n')

  return `
YENİ PAKET TALEBİ

Paket Bilgileri:
- Paket: ${data.package}
- Seçili Modüller:
${data.modules.map((module: string) => `  • ${module}`).join('\n')}

Müşteri Bilgileri:
- İsim: ${data.formData.firstName} ${data.formData.lastName}
- E-posta: ${data.formData.email}
- Telefon: ${data.formData.phone}
${data.formData.companyInfo ? `- Kurumsal Bilgi: ${data.formData.companyInfo}` : ''}

${socialMediaList ? `Sosyal Medya Hesapları:\n${socialMediaList}` : ''}

---
Bu e-posta otomatik olarak gönderilmiştir.
  `
}

