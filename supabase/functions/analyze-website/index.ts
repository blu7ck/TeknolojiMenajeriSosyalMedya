import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  requestId: string
  website: string
  name: string
  email: string
}

interface AnalysisResult {
  performance: any
  seo: any
  social: any
  ai_insights: any
  report_data: any
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { requestId, website, name, email }: AnalysisRequest = await req.json()

    console.log(`🔍 Starting analysis for: ${website}`)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update status to processing
    await supabase
      .from('digital_analysis_requests')
      .update({ 
        status: 'processing',
        processed_at: new Date().toISOString()
      })
      .eq('id', requestId)

    // 1. Performance Analysis (Google PageSpeed Insights)
    const performance = await analyzePerformance(website)
    console.log('✅ Performance analysis completed')

    // 2. SEO Analysis
    const seo = await analyzeSEO(website)
    console.log('✅ SEO analysis completed')

    // 3. Social Media Analysis
    const social = await analyzeSocialMedia(website)
    console.log('✅ Social media analysis completed')

    // 4. AI Insights
    const ai_insights = await generateAIInsights(website, performance, seo, social)
    console.log('✅ AI insights generated')

    // 5. Generate Report Data
    const report_data = {
      website,
      name,
      email,
      analysis_date: new Date().toISOString(),
      performance,
      seo,
      social,
      ai_insights,
      summary: generateSummary(performance, seo, social, ai_insights)
    }

    // 6. Generate Markdown Report
    const markdownReport = generateMarkdownReport(report_data)
    console.log('✅ Markdown report generated')

    // 7. PDF generation (temporarily disabled - HTML to PDF needs proper implementation)
    // TODO: Implement proper HTML to PDF conversion using a service like Puppeteer
    let pdfUrl = null
    console.log('⚠️ PDF generation skipped (not implemented yet)')

    // Save analysis results to database
    await supabase
      .from('digital_analysis_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        analysis_data: {
          performance,
          seo,
          social,
          ai_insights
        },
        report_data: {
          ...report_data,
          markdown_report: markdownReport,
          pdf_url: pdfUrl
        }
      })
      .eq('id', requestId)

    console.log('✅ Analysis completed and saved to database')

    // 9. Send Report Email to User
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          type: 'analysis_report',
          to: email,
          data: {
            name,
            email,
            website,
            requestId,
            report_summary: report_data.summary,
            markdown_report: markdownReport,
            pdf_url: pdfUrl
          }
        })
      })

      if (emailResponse.ok) {
        console.log('✅ Report email sent to user')
      } else {
        console.error('❌ Failed to send report email')
      }
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the analysis if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Analysis completed successfully',
        report_data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Analysis error:', error)
    
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

// Performance Analysis using Google PageSpeed Insights
async function analyzePerformance(website: string) {
  try {
    const apiKey = Deno.env.get('GOOGLE_PAGESPEED_API_KEY')
    if (!apiKey) {
      console.warn('⚠️ Google PageSpeed API key not configured')
      return {
        mobile_score: 0,
        accessibility_score: 0,
        best_practices_score: 0,
        seo_score: 0,
        metrics: { fcp: 'N/A', lcp: 'N/A', cls: 'N/A', fid: 'N/A' },
        opportunities: [],
        error: 'API key not configured'
      }
    }

    console.log('📊 Calling PageSpeed API for:', website)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(website)}&key=${apiKey}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`
    console.log('🔗 PageSpeed API URL (without key):', apiUrl.replace(apiKey, 'HIDDEN'))
    
    const response = await fetch(apiUrl)
    console.log('📡 PageSpeed API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ PageSpeed API error:', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      })
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText)
        console.error('📋 PageSpeed API error details:', errorJson)
      } catch (e) {
        console.error('📋 PageSpeed API raw error:', errorText)
      }
      
      throw new Error(`PageSpeed API error: ${response.status} - ${errorText.substring(0, 200)}`)
    }

    const data = await response.json()
    console.log('✅ PageSpeed data received')
    
    return {
      mobile_score: (data.lighthouseResult?.categories?.performance?.score || 0) * 100,
      accessibility_score: (data.lighthouseResult?.categories?.accessibility?.score || 0) * 100,
      best_practices_score: (data.lighthouseResult?.categories?.['best-practices']?.score || 0) * 100,
      seo_score: (data.lighthouseResult?.categories?.seo?.score || 0) * 100,
      metrics: {
        fcp: data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || 'N/A',
        lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A',
        cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A',
        fid: data.lighthouseResult?.audits?.['max-potential-fid']?.displayValue || 'N/A'
      },
      opportunities: (data.lighthouseResult?.categories?.performance?.auditRefs || [])
        .filter((audit: any) => audit.result?.score < 0.9)
        .map((audit: any) => ({
          id: audit.id,
          title: audit.result?.title,
          description: audit.result?.description,
          score: audit.result?.score
        }))
    }
  } catch (error) {
    console.error('❌ Performance analysis error:', error)
    return {
      mobile_score: 0,
      accessibility_score: 0,
      best_practices_score: 0,
      seo_score: 0,
      metrics: { fcp: 'N/A', lcp: 'N/A', cls: 'N/A', fid: 'N/A' },
      opportunities: [],
      error: error.message
    }
  }
}

// SEO Analysis
async function analyzeSEO(website: string) {
  try {
    console.log('🔍 Fetching website HTML for SEO analysis:', website)
    const response = await fetch(website)
    
    if (!response.ok) {
      console.error('❌ Failed to fetch website:', response.status)
      throw new Error(`Failed to fetch website: ${response.status}`)
    }
    
    const html = await response.text()
    console.log('✅ HTML fetched, length:', html.length)
    
    // Extract meta tags
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/i)
    const keywordsMatch = html.match(/<meta name="keywords" content="(.*?)"/i)
    
    // Count headings
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length
    
    // Check for images without alt tags
    const imgTags = html.match(/<img[^>]*>/gi) || []
    const imagesWithoutAlt = imgTags.filter(img => !img.includes('alt=')).length
    
    return {
      title: titleMatch?.[1] || 'No title found',
      description: descriptionMatch?.[1] || 'No description found',
      keywords: keywordsMatch?.[1] || 'No keywords found',
      headings: {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count
      },
      images_without_alt: imagesWithoutAlt,
      total_images: imgTags.length,
      seo_score: calculateSEOScore({
        hasTitle: !!titleMatch,
        hasDescription: !!descriptionMatch,
        h1Count,
        imagesWithoutAlt,
        totalImages: imgTags.length
      })
    }
  } catch (error) {
    console.error('SEO analysis error:', error)
    return { error: error.message }
  }
}

// Social Media Analysis
async function analyzeSocialMedia(website: string) {
  try {
    console.log('🌐 Fetching website HTML for social media analysis:', website)
    const response = await fetch(website)
    
    if (!response.ok) {
      console.error('❌ Failed to fetch website:', response.status)
      throw new Error(`Failed to fetch website: ${response.status}`)
    }
    
    const html = await response.text()
    console.log('✅ HTML fetched for social analysis')
    
    // Check for social media meta tags
    const ogTitle = html.match(/<meta property="og:title" content="(.*?)"/i)?.[1]
    const ogDescription = html.match(/<meta property="og:description" content="(.*?)"/i)?.[1]
    const ogImage = html.match(/<meta property="og:image" content="(.*?)"/i)?.[1]
    const twitterCard = html.match(/<meta name="twitter:card" content="(.*?)"/i)?.[1]
    
    // Check for social media links
    const socialLinks = {
      facebook: (html.match(/facebook\.com/gi) || []).length,
      twitter: (html.match(/twitter\.com/gi) || []).length,
      instagram: (html.match(/instagram\.com/gi) || []).length,
      linkedin: (html.match(/linkedin\.com/gi) || []).length,
      youtube: (html.match(/youtube\.com/gi) || []).length
    }
    
    return {
      open_graph: {
        title: ogTitle || 'No Open Graph title',
        description: ogDescription || 'No Open Graph description',
        image: ogImage || 'No Open Graph image'
      },
      twitter_card: twitterCard || 'No Twitter Card',
      social_links: socialLinks,
      social_score: calculateSocialScore({
        hasOgTitle: !!ogTitle,
        hasOgDescription: !!ogDescription,
        hasOgImage: !!ogImage,
        hasTwitterCard: !!twitterCard,
        socialLinksCount: Object.values(socialLinks).reduce((a, b) => a + b, 0)
      })
    }
  } catch (error) {
    console.error('Social media analysis error:', error)
    return { error: error.message }
  }
}

// AI Insights Generation using Google Gemini
async function generateAIInsights(website: string, performance: any, seo: any, social: any) {
  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      console.warn('Gemini API key not configured')
      return { 
        insights: 'AI analysis not configured',
        recommendations: ['Configure Gemini API key for AI insights']
      }
    }

    const prompt = `
    Analyze this website: ${website}
    
    Performance Score: ${performance.mobile_score || 'N/A'}
    SEO Score: ${seo.seo_score || 'N/A'}
    Social Score: ${social.social_score || 'N/A'}
    
    Provide 5 key insights and 5 actionable recommendations for improvement.
    Focus on digital marketing and business growth opportunities.
    `

    // Updated model name for v1beta API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
    console.log('🤖 Calling Gemini API...')
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a digital marketing expert. Provide actionable insights and recommendations.

${prompt}

Please provide:
1. 5 key insights about the website's digital presence
2. 5 actionable recommendations for improvement
3. Focus on digital marketing and business growth opportunities

Format your response clearly with numbered lists.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    })

    console.log('📡 Gemini API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Gemini API error:', { status: response.status, error: errorText })
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text

    return {
      insights: aiResponse,
      recommendations: extractRecommendations(aiResponse)
    }
  } catch (error) {
    console.error('AI insights error:', error)
    
    // Fallback: Generate basic insights based on scores
    const fallbackInsights = `
Dijital Varlık Analizi:

**Performans Değerlendirmesi:**
${performance.mobile_score >= 80 ? '✅ Mobil performansınız iyi durumda.' : '⚠️ Mobil performansınızı iyileştirmeniz önerilir.'}
${performance.accessibility_score >= 80 ? '✅ Erişilebilirlik standartlarına uyumlusunuz.' : '⚠️ Erişilebilirlik iyileştirmeleri gerekiyor.'}

**SEO Durumu:**
${seo.seo_score >= 80 ? '✅ SEO optimizasyonunuz başarılı.' : '⚠️ SEO iyileştirmeleri yapılmalı.'}
${seo.title && seo.title !== 'No title found' ? '✅ Sayfa başlığı mevcut.' : '❌ Sayfa başlığı eksik.'}
${seo.description && seo.description !== 'No description found' ? '✅ Meta açıklaması mevcut.' : '❌ Meta açıklaması eksik.'}

**Sosyal Medya:**
${social.social_score >= 80 ? '✅ Sosyal medya entegrasyonunuz iyi.' : '⚠️ Sosyal medya optimizasyonu gerekiyor.'}
${social.open_graph?.title && social.open_graph.title !== 'No Open Graph title' ? '✅ Open Graph etiketleri mevcut.' : '❌ Open Graph etiketleri eksik.'}

**Öneriler:**
1. Görselleri optimize edin ve sıkıştırın
2. Meta etiketlerinizi güncelleyin
3. Sosyal medya entegrasyonunu güçlendirin
4. Mobil uyumluluğu test edin
5. Sayfa yükleme hızını iyileştirin
`
    
    return { 
      insights: fallbackInsights,
      recommendations: [
        'Görselleri optimize edin ve sıkıştırın',
        'Meta etiketlerinizi güncelleyin',
        'Sosyal medya entegrasyonunu güçlendirin',
        'Mobil uyumluluğu test edin',
        'Sayfa yükleme hızını iyileştirin'
      ]
    }
  }
}

// Helper Functions
function calculateSEOScore(data: any): number {
  let score = 0
  if (data.hasTitle) score += 20
  if (data.hasDescription) score += 20
  if (data.h1Count === 1) score += 20
  if (data.imagesWithoutAlt === 0) score += 20
  if (data.totalImages > 0) score += 20
  return Math.min(score, 100)
}

function calculateSocialScore(data: any): number {
  let score = 0
  if (data.hasOgTitle) score += 25
  if (data.hasOgDescription) score += 25
  if (data.hasOgImage) score += 25
  if (data.hasTwitterCard) score += 25
  return Math.min(score, 100)
}

function extractRecommendations(aiResponse: string): string[] {
  const lines = aiResponse.split('\n')
  return lines
    .filter(line => line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.'))
    .slice(0, 5)
    .map(line => line.replace(/^[•\-\d\.\s]+/, '').trim())
}

function generateSummary(performance: any, seo: any, social: any, ai_insights: any) {
  return {
    overall_score: Math.round((
      (performance.mobile_score || 0) + 
      (seo.seo_score || 0) + 
      (social.social_score || 0)
    ) / 3),
    strengths: [
      performance.mobile_score > 80 ? 'Good Performance' : null,
      seo.seo_score > 80 ? 'Good SEO' : null,
      social.social_score > 80 ? 'Good Social Media' : null
    ].filter(Boolean),
    improvements: [
      performance.mobile_score < 60 ? 'Improve Performance' : null,
      seo.seo_score < 60 ? 'Improve SEO' : null,
      social.social_score < 60 ? 'Improve Social Media' : null
    ].filter(Boolean)
  }
}

function generateMarkdownReport(reportData: any): string {
  const { website, name, analysis_date, performance, seo, social, ai_insights, summary } = reportData

  return `# Dijital Analiz Raporu

**Website:** ${website}  
**Müşteri:** ${name}  
**Analiz Tarihi:** ${new Date(analysis_date).toLocaleDateString('tr-TR')}

---

## 📊 Genel Değerlendirme

**Toplam Skor:** ${summary.overall_score}/100

### Güçlü Yönler:
${summary.strengths.map((s: string) => `✅ ${s}`).join('\n')}

### Geliştirilmesi Gerekenler:
${summary.improvements.map((i: string) => `⚠️ ${i}`).join('\n')}

---

## ⚡ Performans Analizi

**Mobil Performans Skoru:** ${Math.round(performance.mobile_score || 0)}/100  
**Erişilebilirlik Skoru:** ${Math.round(performance.accessibility_score || 0)}/100  
**En İyi Uygulamalar Skoru:** ${Math.round(performance.best_practices_score || 0)}/100

### Temel Metrikler:
- **First Contentful Paint (FCP):** ${performance.metrics?.fcp || 'N/A'}
- **Largest Contentful Paint (LCP):** ${performance.metrics?.lcp || 'N/A'}
- **Cumulative Layout Shift (CLS):** ${performance.metrics?.cls || 'N/A'}
- **First Input Delay (FID):** ${performance.metrics?.fid || 'N/A'}

---

## 🔍 SEO Analizi

**SEO Skoru:** ${Math.round(seo.seo_score || 0)}/100

### Sayfa Bilgileri:
- **Başlık:** ${seo.title}
- **Açıklama:** ${seo.description}
- **H1 Başlık Sayısı:** ${seo.headings?.h1 || 0}
- **H2 Başlık Sayısı:** ${seo.headings?.h2 || 0}
- **H3 Başlık Sayısı:** ${seo.headings?.h3 || 0}

### Görseller:
- **Toplam Görsel:** ${seo.total_images || 0}
- **Alt Etiketi Eksik Görsel:** ${seo.images_without_alt || 0}

---

## 🌐 Sosyal Medya Analizi

**Sosyal Medya Skoru:** ${Math.round(social.social_score || 0)}/100

### Open Graph Meta Tags:
- **Başlık:** ${social.open_graph?.title || 'Yok'}
- **Açıklama:** ${social.open_graph?.description || 'Yok'}
- **Görsel:** ${social.open_graph?.image || 'Yok'}

### Twitter Card:
- **Twitter Card:** ${social.twitter_card || 'Yok'}

### Sosyal Medya Bağlantıları:
- **Facebook:** ${social.social_links?.facebook || 0} bağlantı
- **Twitter:** ${social.social_links?.twitter || 0} bağlantı
- **Instagram:** ${social.social_links?.instagram || 0} bağlantı
- **LinkedIn:** ${social.social_links?.linkedin || 0} bağlantı
- **YouTube:** ${social.social_links?.youtube || 0} bağlantı

---

## 🤖 AI Öngörüleri ve Öneriler

${ai_insights.insights || 'AI analizi mevcut değil'}

---

## 📞 İletişim

Bu rapor hakkında sorularınız için:  
**Email:** gulsah@teknolojimenajeri.com  
**Website:** https://teknolojimenajeri.com

---

*Bu rapor Teknoloji Menajeri tarafından otomatik olarak oluşturulmuştur.*
`
}

// Markdown to PDF conversion
async function generatePDFFromMarkdown(markdown: string, website: string): Promise<Uint8Array> {
  try {
    // Convert Markdown to HTML
    const html = markdownToHTML(markdown)
    
    // Generate styled HTML for PDF
    const styledHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #DC2626;
            border-bottom: 3px solid #DC2626;
            padding-bottom: 10px;
            margin-top: 30px;
          }
          h2 {
            color: #991B1B;
            border-left: 4px solid #DC2626;
            padding-left: 10px;
            margin-top: 25px;
          }
          h3 {
            color: #7F1D1D;
            margin-top: 20px;
          }
          p {
            margin: 10px 0;
          }
          ul, ol {
            margin: 10px 0;
            padding-left: 30px;
          }
          li {
            margin: 5px 0;
          }
          strong {
            color: #DC2626;
          }
          hr {
            border: none;
            border-top: 2px solid #E5E7EB;
            margin: 30px 0;
          }
          .score {
            font-size: 24px;
            font-weight: bold;
            color: #DC2626;
          }
          .header {
            background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `
    
    // Use jsPDF or similar library
    // For Deno Edge Functions, we'll use a simple HTML to PDF conversion
    // Note: This is a placeholder - actual PDF generation would require a proper library
    
    // Convert HTML to PDF using https://cloudconvert.com or similar service
    // For now, we'll return a base64 encoded placeholder
    const pdfContent = new TextEncoder().encode(styledHTML)
    
    return pdfContent
  } catch (error) {
    console.error('PDF generation error:', error)
    throw error
  }
}

// Simple Markdown to HTML converter
function markdownToHTML(markdown: string): string {
  let html = markdown
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr>')
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  
  // Clean up
  html = html.replace(/<p><h/g, '<h')
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>')
  html = html.replace(/<p><ul>/g, '<ul>')
  html = html.replace(/<\/ul><\/p>/g, '</ul>')
  html = html.replace(/<p><hr><\/p>/g, '<hr>')
  
  return html
}
