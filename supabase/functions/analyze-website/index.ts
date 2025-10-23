import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

// Simple in-memory rate limiting
const requestQueue = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
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

    // Simple rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const clientRequests = requestQueue.get(clientIp) || 0
    
    if (clientRequests >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIp}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
          status: 429 
        }
      )
    }
    
    // Update rate limit counter
    requestQueue.set(clientIp, clientRequests + 1)
    
    // Clean up old entries
    if (requestQueue.size > 1000) {
      const cutoff = now - RATE_LIMIT_WINDOW
      for (const [ip, timestamp] of requestQueue.entries()) {
        if (timestamp < cutoff) {
          requestQueue.delete(ip)
        }
      }
    }

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
    const seo = await analyzeSEOMetrics(website)
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

    // 7. Generate PDF and upload to Supabase Storage
    let pdfUrl = null
    try {
      console.log('📄 Generating PDF report...')
      const pdfBuffer = await generatePDFFromMarkdown(markdownReport, website)
      
      // Upload PDF to Supabase Storage
      const fileName = `digital-analysis-report-${requestId}-${Date.now()}.pdf`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('digital-analysis-reports')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        })
      
      if (uploadError) {
        console.error('❌ Supabase Storage upload error:', uploadError)
        throw uploadError
      }
      
      const { data: urlData } = supabase.storage
        .from('digital-analysis-reports')
        .getPublicUrl(fileName)
      
      pdfUrl = urlData.publicUrl
      console.log('✅ PDF uploaded to Supabase Storage:', pdfUrl)
      
      // Also upload Markdown to GitHub Gist as backup
      try {
        const gistData = {
          description: `Dijital Analiz Raporu - ${website}`,
          public: false,
          files: {
            'rapor.md': {
              content: markdownReport
            }
          }
        }
        
        const githubToken = Deno.env.get('GITHUB_TOKEN')
        if (githubToken) {
          const gistResponse = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Content-Type': 'application/json',
              'User-Agent': 'Teknoloji-Menajeri-Bot'
            },
            body: JSON.stringify(gistData)
          })
          
          if (gistResponse.ok) {
            const gistResult = await gistResponse.json()
            console.log('✅ Markdown backup uploaded to GitHub Gist:', gistResult.html_url)
          }
        }
      } catch (gistError) {
        console.warn('⚠️ GitHub Gist backup failed (non-critical):', gistError)
      }
      
    } catch (pdfError) {
      console.error('❌ PDF generation/upload error:', pdfError)
      // Continue without PDF - don't fail the entire analysis
    }

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
    
    // Try to extract request details for error logging
    let requestId = 'unknown'
    let website = 'unknown'
    
    try {
      const requestData = await req.json()
      requestId = requestData.requestId || 'unknown'
      website = requestData.website || 'unknown'
    } catch (parseError) {
      console.warn('Could not parse request data for error logging')
    }
    
    // Enhanced error logging with context
    const errorContext = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      requestId,
      website,
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    }
    
    console.error('📊 Error context:', JSON.stringify(errorContext, null, 2))
    
    // Only update database status to failed if this is a critical error
    // (not just a temporary API issue that might be resolved by retries)
    const isCriticalError = error.message.includes('Network') || 
                          error.message.includes('Timeout') ||
                          error.message.includes('Connection') ||
                          error.message.includes('Database') ||
                          error.message.includes('Supabase')
    
    if (isCriticalError) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        if (requestId !== 'unknown') {
          await supabase
            .from('digital_analysis_requests')
            .update({
              status: 'failed',
              error_message: error.message,
              failed_at: new Date().toISOString()
            })
            .eq('id', requestId)
            
          console.log('✅ Critical error status updated in database')
        }
      } catch (dbError) {
        console.error('❌ Failed to update error status in database:', dbError)
      }
    } else {
      console.log('⚠️ Non-critical error, not updating database status (retries may succeed)')
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        requestId,
        timestamp: new Date().toISOString()
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
async function analyzeSEOMetrics(website: string) {
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

// AI Insights Generation using Google Gemini with retry mechanism
async function generateAIInsights(website: string, performance: any, seo: any, social: any) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  if (!geminiApiKey) {
    console.warn('Gemini API key not configured')
    return { 
      insights: 'AI analysis not configured',
      recommendations: ['Configure Gemini API key for AI insights']
    }
  }

  const prompt = `${website} web sitesini analiz et. Skorlar: Mobil ${performance.mobile_score || 'N/A'}, SEO ${seo.seo_score || 'N/A'}, Sosyal Medya ${social.social_score || 'N/A'}. 2 öngörü + 2 öneri ver. Maksimum 300 kelime. Türkçe yanıt ver.`

  // Retry mechanism with exponential backoff
  const maxRetries = 3
  const baseDelay = 1000 // 1 second
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Calling Gemini API (attempt ${attempt}/${maxRetries})...`)
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 10000,
            temperature: 0.7,
          }
        })
      })

      console.log('📡 Gemini API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Gemini API error (attempt ${attempt}):`, { status: response.status, error: errorText })
        
        // Check if it's a retryable error (503, 429, 500, 502, 504)
        const retryableStatuses = [503, 429, 500, 502, 504]
        if (retryableStatuses.includes(response.status) && attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        
        // If not retryable or max retries reached, throw error
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📦 Gemini API response structure:', JSON.stringify(data).substring(0, 500))
      
      // Check if response has expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Unexpected Gemini API response structure')
        throw new Error('Invalid Gemini API response structure')
      }
      
      // Handle different response structures
      let aiResponse = ''
      if (data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        aiResponse = data.candidates[0].content.parts[0].text || ''
      } else if (data.candidates[0].content.role) {
        // Handle case where content only has role (MAX_TOKENS finish reason)
        console.log('⚠️ Gemini response truncated (MAX_TOKENS), using fallback')
        aiResponse = 'Dijital Varlık Analizi: Website analizi tamamlandı ancak AI yanıtı token limiti nedeniyle kesildi. Temel analiz sonuçları yukarıda mevcut.'
      } else {
        console.error('❌ No valid content found in Gemini response')
        throw new Error('No valid content in Gemini response')
      }
      
      console.log('✅ AI response extracted, length:', aiResponse?.length || 0)

      return {
        insights: aiResponse,
        recommendations: extractRecommendations(aiResponse)
      }
      
    } catch (error) {
      console.error(`❌ Gemini API attempt ${attempt} failed:`, error.message)
      
      // If this is the last attempt, fall through to fallback
      if (attempt === maxRetries) {
        console.log('🔄 All Gemini API attempts failed, using fallback insights')
        break
      }
      
      // Wait before retry
      const delay = baseDelay * Math.pow(2, attempt - 1)
      console.log(`⏳ Waiting ${delay}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  // Fallback: Generate enhanced insights based on scores
  console.log('🔄 Using fallback AI insights generation')
  return generateFallbackInsights(website, performance, seo, social)
}

// Enhanced fallback insights generation
function generateFallbackInsights(website: string, performance: any, seo: any, social: any) {
  const overallScore = Math.round((
    (performance.mobile_score || 0) + 
    (seo.seo_score || 0) + 
    (social.social_score || 0)
  ) / 3)
  
  const performanceGrade = performance.mobile_score >= 80 ? 'A' : performance.mobile_score >= 60 ? 'B' : 'C'
  const seoGrade = seo.seo_score >= 80 ? 'A' : seo.seo_score >= 60 ? 'B' : 'C'
  const socialGrade = social.social_score >= 80 ? 'A' : social.social_score >= 60 ? 'B' : 'C'
  
  const insights = `
DİJİTAL VARLIK ANALİZİ - ${website}

GENEL DEĞERLENDİRME:
Toplam Skor: ${overallScore}/100
Performans: ${performanceGrade} (${Math.round(performance.mobile_score || 0)}/100)
SEO: ${seoGrade} (${Math.round(seo.seo_score || 0)}/100)
Sosyal Medya: ${socialGrade} (${Math.round(social.social_score || 0)}/100)

DETAYLI ANALİZ:

⚡ PERFORMANS DURUMU:
${performance.mobile_score >= 80 ? '✅ Mobil performansınız mükemmel durumda.' : performance.mobile_score >= 60 ? '⚠️ Mobil performansınız orta seviyede, iyileştirme gerekiyor.' : '❌ Mobil performansınız kritik seviyede, acil iyileştirme gerekli.'}
${performance.accessibility_score >= 80 ? '✅ Erişilebilirlik standartlarına tam uyumlusunuz.' : '⚠️ Erişilebilirlik iyileştirmeleri yapılmalı.'}

🔍 SEO OPTİMİZASYONU:
${seo.seo_score >= 80 ? '✅ SEO optimizasyonunuz başarılı.' : '⚠️ SEO iyileştirmeleri yapılmalı.'}
${seo.title && seo.title !== 'No title found' ? '✅ Sayfa başlığı optimize edilmiş.' : '❌ Sayfa başlığı eksik veya optimize edilmemiş.'}
${seo.description && seo.description !== 'No description found' ? '✅ Meta açıklaması mevcut.' : '❌ Meta açıklaması eksik.'}
${seo.headings?.h1 === 1 ? '✅ H1 başlık yapısı doğru.' : '⚠️ H1 başlık yapısını kontrol edin.'}

🌐 SOSYAL MEDYA ENTEGRASYONU:
${social.social_score >= 80 ? '✅ Sosyal medya entegrasyonunuz mükemmel.' : '⚠️ Sosyal medya optimizasyonu gerekiyor.'}
${social.open_graph?.title && social.open_graph.title !== 'No Open Graph title' ? '✅ Open Graph etiketleri mevcut.' : '❌ Open Graph etiketleri eksik.'}
${social.twitter_card && social.twitter_card !== 'No Twitter Card' ? '✅ Twitter Card yapılandırılmış.' : '❌ Twitter Card eksik.'}

🎯 ÖNCELİKLİ ÖNERİLER:
${generatePriorityRecommendations(performance, seo, social)}
`
  
  return { 
    insights: insights,
    recommendations: generatePriorityRecommendations(performance, seo, social)
  }
}

// Generate priority-based recommendations
function generatePriorityRecommendations(performance: any, seo: any, social: any): string[] {
  const recommendations: string[] = []
  
  // Performance recommendations
  if (performance.mobile_score < 60) {
    recommendations.push('🚀 Sayfa yükleme hızını optimize edin (kritik)')
    recommendations.push('📱 Mobil uyumluluğu iyileştirin')
  }
  
  // SEO recommendations
  if (seo.seo_score < 60) {
    recommendations.push('🔍 Meta etiketlerinizi optimize edin')
    recommendations.push('📝 İçerik yapısını SEO standartlarına uygun hale getirin')
  }
  
  if (seo.images_without_alt > 0) {
    recommendations.push('🖼️ Görsellere alt etiketleri ekleyin')
  }
  
  // Social media recommendations
  if (social.social_score < 60) {
    recommendations.push('📱 Sosyal medya meta etiketlerini ekleyin')
    recommendations.push('🔗 Sosyal medya entegrasyonunu güçlendirin')
  }
  
  // General recommendations
  recommendations.push('📊 Düzenli performans analizi yapın')
  recommendations.push('🔄 İçerikleri güncel tutun')
  
  return recommendations.slice(0, 5) // Limit to 5 recommendations
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

  return `# DİJİTAL ANALİZ RAPORU

Website: ${website}
Müşteri: ${name}
Analiz Tarihi: ${new Date(analysis_date).toLocaleDateString('tr-TR')}

═══════════════════════════════════════════════════════════════════════════════

📊 GENEL DEĞERLENDİRME

Toplam Skor: ${summary.overall_score}/100

Güçlü Yönler:
${summary.strengths.map((s: string) => `✅ ${s}`).join('\n')}

Geliştirilmesi Gerekenler:
${summary.improvements.map((i: string) => `⚠️ ${i}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════

⚡ PERFORMANS ANALİZİ

Mobil Performans Skoru: ${Math.round(performance.mobile_score || 0)}/100
Erişilebilirlik Skoru: ${Math.round(performance.accessibility_score || 0)}/100
En İyi Uygulamalar Skoru: ${Math.round(performance.best_practices_score || 0)}/100

Temel Metrikler:
• First Contentful Paint (FCP): ${performance.metrics?.fcp || 'N/A'}
• Largest Contentful Paint (LCP): ${performance.metrics?.lcp || 'N/A'}
• Cumulative Layout Shift (CLS): ${performance.metrics?.cls || 'N/A'}
• First Input Delay (FID): ${performance.metrics?.fid || 'N/A'}

═══════════════════════════════════════════════════════════════════════════════

🔍 SEO ANALİZİ

SEO Skoru: ${Math.round(seo.seo_score || 0)}/100

Sayfa Bilgileri:
• Başlık: ${seo.title}
• Açıklama: ${seo.description}
• H1 Başlık Sayısı: ${seo.headings?.h1 || 0}
• H2 Başlık Sayısı: ${seo.headings?.h2 || 0}
• H3 Başlık Sayısı: ${seo.headings?.h3 || 0}

Görseller:
• Toplam Görsel: ${seo.total_images || 0}
• Alt Etiketi Eksik Görsel: ${seo.images_without_alt || 0}

═══════════════════════════════════════════════════════════════════════════════

🌐 SOSYAL MEDYA ANALİZİ

Sosyal Medya Skoru: ${Math.round(social.social_score || 0)}/100

Open Graph Meta Tags:
• Başlık: ${social.open_graph?.title || 'Yok'}
• Açıklama: ${social.open_graph?.description || 'Yok'}
• Görsel: ${social.open_graph?.image || 'Yok'}

Twitter Card:
• Twitter Card: ${social.twitter_card || 'Yok'}

Sosyal Medya Bağlantıları:
• Facebook: ${social.social_links?.facebook || 0} bağlantı
• Twitter: ${social.social_links?.twitter || 0} bağlantı
• Instagram: ${social.social_links?.instagram || 0} bağlantı
• LinkedIn: ${social.social_links?.linkedin || 0} bağlantı
• YouTube: ${social.social_links?.youtube || 0} bağlantı

═══════════════════════════════════════════════════════════════════════════════

🤖 AI ÖNGÖRÜLERİ VE ÖNERİLER

${ai_insights.insights || 'AI analizi mevcut değil'}

═══════════════════════════════════════════════════════════════════════════════

📞 İLETİŞİM

Bu rapor hakkında sorularınız için:
Email: gulsah@teknolojimenajeri.com
Website: https://www.teknolojimenajeri.com.tr

Bu rapor Teknoloji Menajeri tarafından otomatik olarak oluşturulmuştur.
`
}

// Generate professional PDF report using Gotenberg
async function generatePDFFromMarkdown(markdown: string, website: string): Promise<Uint8Array> {
  try {
    console.log('📝 Generating PDF report with Gotenberg...')
    console.log('📝 Markdown length:', markdown.length)
    console.log('📝 Website:', website)
    
    // Parse markdown sections
    const lines = markdown.split('\n')
    console.log('📝 Total lines:', lines.length)
    const sections: any = {
      header: {},
      summary: {},
      performance: {},
      seo: {},
      social: {},
      ai: ''
    }
    
    let currentSection = ''
    for (const line of lines) {
      if (line.includes('Website:')) sections.header.website = line.split(':')[1]?.trim()
      if (line.includes('Müşteri:')) sections.header.customer = line.split(':')[1]?.trim()
      if (line.includes('Analiz Tarihi:')) sections.header.date = line.split(':')[1]?.trim()
      if (line.includes('Toplam Skor:')) sections.summary.totalScore = line.split(':')[1]?.trim()
      if (line.includes('Mobil Performans Skoru:')) sections.performance.mobile = line.split(':')[1]?.trim()
      if (line.includes('Erişilebilirlik Skoru:')) sections.performance.accessibility = line.split(':')[1]?.trim()
      if (line.includes('SEO Skoru:')) sections.seo.score = line.split(':')[1]?.trim()
      if (line.includes('Sosyal Medya Skoru:')) sections.social.score = line.split(':')[1]?.trim()
      if (line.includes('## 🤖')) currentSection = 'ai'
      if (currentSection === 'ai' && line.trim()) sections.ai += line + '\n'
    }
    
    const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dijital Analiz Raporu - ${website}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      background: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #DC2626 0%, #000000 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 36px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .header .website {
      font-size: 20px;
      opacity: 0.95;
      margin-bottom: 10px;
    }
    .header .meta {
      font-size: 14px;
      opacity: 0.85;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
    }
    .section:last-child {
      border-bottom: none;
    }
    .section-title {
      color: #DC2626;
      font-size: 28px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #DC2626;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .score-card {
      background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin: 20px 0;
    }
    .score-big {
      font-size: 72px;
      font-weight: bold;
      line-height: 1;
      margin: 10px 0;
    }
    .score-label {
      font-size: 16px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .metric-box {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #DC2626;
    }
    .metric-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #DC2626;
    }
    .info-list {
      list-style: none;
      padding: 0;
    }
    .info-list li {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
    }
    .info-list li:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #333;
    }
    .info-value {
      color: #666;
    }
    .ai-insights {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
      border-left: 4px solid #DC2626;
      white-space: pre-wrap;
      line-height: 1.8;
      font-size: 15px;
    }
    .footer {
      background: #000;
      color: white;
      padding: 40px;
      text-align: center;
    }
    .footer-logo {
      font-size: 24px;
      font-weight: bold;
      color: #DC2626;
      margin-bottom: 10px;
    }
    .footer-text {
      opacity: 0.8;
      margin: 5px 0;
      font-size: 14px;
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #DC2626;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
      z-index: 1000;
    }
    .print-button:hover {
      background: #991B1B;
    }
    @media print {
      .print-button {
        display: none;
      }
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
    }
    @media (max-width: 768px) {
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 28px;
      }
      .content {
        padding: 20px;
      }
      .score-big {
        font-size: 56px;
      }
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ Yazdır / PDF Kaydet</button>
  
  <div class="container">
    <div class="header">
      <h1>📊 DİJİTAL ANALİZ RAPORU</h1>
      <div class="website">${website}</div>
      <div class="meta">
        ${sections.header.customer || ''} | ${sections.header.date || new Date().toLocaleDateString('tr-TR')}
      </div>
    </div>

    <div class="content">
      <!-- Genel Değerlendirme -->
      <div class="section">
        <h2 class="section-title">📈 Genel Değerlendirme</h2>
        <div class="score-card">
          <div class="score-label">Toplam Skor</div>
          <div class="score-big">${sections.summary.totalScore || 'N/A'}</div>
        </div>
      </div>

      <!-- Performans -->
      <div class="section">
        <h2 class="section-title">⚡ Performans Analizi</h2>
        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-label">Mobil Performans</div>
            <div class="metric-value">${sections.performance.mobile || 'N/A'}</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">Erişilebilirlik</div>
            <div class="metric-value">${sections.performance.accessibility || 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- SEO -->
      <div class="section">
        <h2 class="section-title">🔍 SEO Analizi</h2>
        <div class="metric-box">
          <div class="metric-label">SEO Skoru</div>
          <div class="metric-value">${sections.seo.score || 'N/A'}</div>
        </div>
      </div>

      <!-- Sosyal Medya -->
      <div class="section">
        <h2 class="section-title">🌐 Sosyal Medya Analizi</h2>
        <div class="metric-box">
          <div class="metric-label">Sosyal Medya Skoru</div>
          <div class="metric-value">${sections.social.score || 'N/A'}</div>
        </div>
      </div>

      <!-- AI Öngörüleri -->
      <div class="section">
        <h2 class="section-title">🤖 AI Öngörüleri ve Öneriler</h2>
        <div class="ai-insights">${cleanAIInsights(sections.ai || markdown)}</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-logo">Teknoloji Menajeri</div>
      <div class="footer-text">Dijital Pazarlama ve Web Analiz Hizmetleri</div>
      <div class="footer-text">🌐 www.teknolojimenajeri.com.tr</div>
      <div class="footer-text">📧 gulsah@teknolojimenajeri.com</div>
      <div class="footer-text" style="margin-top: 20px; opacity: 0.6; font-size: 12px;">
        Bu rapor otomatik olarak oluşturulmuştur.
      </div>
    </div>
  </div>
</body>
</html>`
    
    console.log('📝 HTML content length:', htmlContent.length)
    console.log('📝 HTML content preview:', htmlContent.substring(0, 200) + '...')
    
    // Convert HTML to PDF using Gotenberg
    const gotenbergUrl = Deno.env.get('GOTENBERG_URL') || 'http://localhost:3000'
    console.log('📤 Sending HTML to Gotenberg at:', gotenbergUrl)
    
    // Create multipart form data
    const formData = new FormData()
    
    // Add HTML file
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
    formData.append('files', htmlBlob, 'index.html')
    
    // Add Gotenberg options for better PDF quality
    formData.append('marginTop', '0')
    formData.append('marginBottom', '0')
    formData.append('marginLeft', '0')
    formData.append('marginRight', '0')
    formData.append('paperWidth', '8.27')     // A4 width in inches
    formData.append('paperHeight', '11.7')    // A4 height in inches
    formData.append('preferCssPageSize', 'false')
    formData.append('printBackground', 'true')
    formData.append('scale', '1.0')
    formData.append('waitDelay', '1s')        // Wait for fonts and styles to load
    
    // Skip health check for free tier services - they can be slow but still work
    // Note: Admin panel controls request volume (100 requests/day max)
    console.log('⏳ Waiting for Gotenberg service (free tier can be slow)...')
    console.log('📊 This is normal for free tier services - please be patient')
    console.log('⏰ Timeout set to 10 minutes for free tier constraints')
    console.log('🎛️ Request volume controlled via admin panel (100/day max)')
    
    const gotenbergResponse = await fetch(`${gotenbergUrl}/forms/chromium/convert/html`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(600000) // 10 minutes timeout for free tier
    })
    
    if (!gotenbergResponse.ok) {
      const errorText = await gotenbergResponse.text()
      console.error('❌ Gotenberg error:', { status: gotenbergResponse.status, error: errorText })
      console.log('🔄 Falling back to alternative PDF generation...')
      return generateFallbackPDF(markdown, website)
    }
    
    const pdfBuffer = await gotenbergResponse.arrayBuffer()
    console.log('✅ PDF generated successfully with Gotenberg (free tier patience paid off!)')
    console.log('📄 PDF size:', pdfBuffer.byteLength, 'bytes')
    
    // Return the PDF buffer
    return new Uint8Array(pdfBuffer)
  } catch (error) {
    console.error('❌ HTML generation error:', error)
    console.error('❌ Error stack:', error.stack)
    console.log('🔄 Falling back to alternative PDF generation...')
    return generateFallbackPDF(markdown, website)
  }
}

// Fallback PDF generation when Gotenberg fails
async function generateFallbackPDF(markdown: string, website: string): Promise<Uint8Array> {
  console.log('📄 Generating fallback PDF...')
  
  try {
    // Create a simple HTML document for fallback
    const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dijital Analiz Raporu - ${website}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
        h2 { color: #34495e; margin-top: 25px; }
        h3 { color: #7f8c8d; margin-top: 15px; }
        .score { background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 8px 0; }
        .good { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        ul, ol { margin: 8px 0; padding-left: 20px; }
        li { margin: 4px 0; }
        .footer { 
            margin-top: 30px; 
            padding-top: 15px; 
            border-top: 1px solid #dee2e6; 
            font-size: 0.9em; 
            color: #6c757d; 
            text-align: center;
        }
        .fallback-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="fallback-notice">
        <strong>Not:</strong> Bu rapor alternatif PDF oluşturma yöntemi ile üretilmiştir. 
        Gotenberg servisi geçici olarak kullanılamıyor.
    </div>
    ${cleanAIInsights(markdown)}
    <div class="footer">
        <p><strong>Teknoloji Menajeri</strong> - Dijital Analiz Raporu</p>
        <p>🌐 www.teknolojimenajeri.com.tr | 📧 gulsah@teknolojimenajeri.com</p>
        <p style="margin-top: 10px; opacity: 0.7; font-size: 12px;">
            Bu rapor otomatik olarak oluşturulmuştur.
        </p>
    </div>
</body>
</html>`

    // For now, we'll create a simple text-based "PDF" 
    // In a real implementation, you might want to use a different PDF service
    const textContent = markdown.replace(/<[^>]*>/g, '').replace(/\n/g, '\n')
    
    // Create a minimal PDF structure
    const pdfContent = createSimplePDF(textContent, website)
    
    console.log('✅ Fallback PDF generated successfully:', pdfContent.length, 'bytes')
    return new Uint8Array(Buffer.from(pdfContent, 'utf8'))
  } catch (error) {
    console.error('❌ Fallback PDF generation error:', error)
    
    // Last resort: create a very basic PDF
    const basicContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Dijital Analiz Raporu - ${website}) Tj
0 -20 Td
(Bu rapor alternatif yöntemle oluşturulmuştur.) Tj
0 -20 Td
(Teknoloji Menajeri) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
500
%%EOF`
    
    return new Uint8Array(Buffer.from(basicContent, 'utf8'))
  }
}

// Clean AI insights by removing markdown formatting
function cleanAIInsights(insights: string): string {
  if (!insights) return ''
  
  return insights
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove list markers and convert to HTML
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/gm, '')
    // Convert line breaks to HTML
    .replace(/\n/g, '<br>')
    // Remove any remaining markdown artifacts
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
}

// Create a simple PDF content
function createSimplePDF(content: string, website: string): string {
  const lines = content.split('\n').slice(0, 50) // Limit to 50 lines
  const contentText = lines.join('\\n')
  
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length ${contentText.length + 200}
>>
stream
BT
/F1 12 Tf
50 750 Td
(Dijital Analiz Raporu - ${website}) Tj
0 -20 Td
(${contentText.substring(0, 1000)}) Tj
0 -20 Td
(Teknoloji Menajeri - Alternatif PDF) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${1000 + contentText.length}
%%EOF`
}

