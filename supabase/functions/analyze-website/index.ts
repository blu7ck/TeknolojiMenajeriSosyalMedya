import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
        report_data
      })
      .eq('id', requestId)

    console.log('✅ Analysis completed and saved to database')

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
      console.warn('Google PageSpeed API key not configured')
      return { error: 'Performance analysis not configured' }
    }

    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(website)}&key=${apiKey}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`
    )

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      mobile_score: data.lighthouseResult.categories.performance.score * 100,
      accessibility_score: data.lighthouseResult.categories.accessibility.score * 100,
      best_practices_score: data.lighthouseResult.categories['best-practices'].score * 100,
      seo_score: data.lighthouseResult.categories.seo.score * 100,
      metrics: {
        fcp: data.lighthouseResult.audits['first-contentful-paint']?.displayValue,
        lcp: data.lighthouseResult.audits['largest-contentful-paint']?.displayValue,
        cls: data.lighthouseResult.audits['cumulative-layout-shift']?.displayValue,
        fid: data.lighthouseResult.audits['max-potential-fid']?.displayValue
      },
      opportunities: data.lighthouseResult.categories.performance.auditRefs
        .filter((audit: any) => audit.result?.score < 0.9)
        .map((audit: any) => ({
          id: audit.id,
          title: audit.result?.title,
          description: audit.result?.description,
          score: audit.result?.score
        }))
    }
  } catch (error) {
    console.error('Performance analysis error:', error)
    return { error: error.message }
  }
}

// SEO Analysis
async function analyzeSEO(website: string) {
  try {
    // Basic SEO checks
    const response = await fetch(website)
    const html = await response.text()
    
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
    const response = await fetch(website)
    const html = await response.text()
    
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text

    return {
      insights: aiResponse,
      recommendations: extractRecommendations(aiResponse)
    }
  } catch (error) {
    console.error('AI insights error:', error)
    return { 
      insights: 'AI analysis failed',
      recommendations: ['AI analysis is currently unavailable']
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
