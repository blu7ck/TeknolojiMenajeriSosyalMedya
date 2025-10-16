// SEO Utility Functions

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export function updatePageSEO(seoData: SEOData) {
  const {
    title = "Teknoloji Menajeri - Sosyal Medya Ajansı",
    description = "En güncel teknoloji haberleri, sosyal medya yönetimi ve dijital pazarlama hizmetleri.",
    keywords = "teknoloji, sosyal medya, blog, dijital pazarlama",
    image = "https://i.ibb.co/CstJSnMp/logo.png",
    url = window.location.href,
    type = "website"
  } = seoData

  // Update title
  document.title = title

  // Update meta tags
  updateMetaTag('name', 'description', description)
  updateMetaTag('name', 'keywords', keywords)
  updateMetaTag('property', 'og:title', title)
  updateMetaTag('property', 'og:description', description)
  updateMetaTag('property', 'og:url', url)
  updateMetaTag('property', 'og:image', image)
  updateMetaTag('property', 'og:type', type)
  updateMetaTag('name', 'twitter:title', title)
  updateMetaTag('name', 'twitter:description', description)
  updateMetaTag('name', 'twitter:image', image)

  // Update canonical URL
  updateCanonicalURL(url)
}

function updateMetaTag(attribute: string, name: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    document.head.appendChild(meta)
  }
  meta.content = content
}

function updateCanonicalURL(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}

// Blog post için özel SEO
export function setBlogPostSEO(post: {
  title: string
  excerpt?: string
  cover_image?: string
  slug: string
  category?: string
  tags?: string[]
}) {
  const baseUrl = 'https://teknolojimenajeri.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`
  
  // Akıllı anahtar kelime oluşturma
  const smartKeywords = generateSmartKeywords(post)
  
  updatePageSEO({
    title: `${post.title} | Teknoloji Menajeri Blog`,
    description: post.excerpt || `Teknoloji Menajeri blog yazısı: ${post.title}`,
    keywords: smartKeywords,
    image: post.cover_image || 'https://i.ibb.co/CstJSnMp/logo.png',
    url: postUrl,
    type: 'article'
  })
}

// Akıllı anahtar kelime oluşturma
function generateSmartKeywords(post: {
  title: string
  category?: string
  tags?: string[]
}): string {
  const baseKeywords = ['teknoloji', 'blog', 'teknoloji menajeri']
  
  // Başlıktan anahtar kelimeler çıkar
  const titleKeywords = extractKeywordsFromTitle(post.title)
  
  // Kategori bazlı anahtar kelimeler
  const categoryKeywords = getCategoryKeywords(post.category)
  
  // Tag'lerden anahtar kelimeler
  const tagKeywords = post.tags || []
  
  // Tüm anahtar kelimeleri birleştir ve tekrarları kaldır
  const allKeywords = [
    ...baseKeywords,
    ...titleKeywords,
    ...categoryKeywords,
    ...tagKeywords
  ]
  
  // Tekrarları kaldır ve virgülle ayır
  const uniqueKeywords = [...new Set(allKeywords)]
    .filter(keyword => keyword.length > 2) // Çok kısa kelimeleri filtrele
    .slice(0, 15) // Maksimum 15 anahtar kelime
  
  return uniqueKeywords.join(', ')
}

// Başlıktan anahtar kelime çıkarma
function extractKeywordsFromTitle(title: string): string[] {
  // Türkçe stop words (gereksiz kelimeler)
  const stopWords = [
    've', 'ile', 'bir', 'bu', 'şu', 'o', 'için', 'olan', 'olan', 'gibi',
    'kadar', 'sonra', 'önce', 'üzerinde', 'altında', 'arasında',
    'nedir', 'nasıl', 'ne', 'hangi', 'kim', 'nerede', 'ne zaman',
    'artık', 'hala', 'henüz', 'sadece', 'yalnız', 'ancak', 'fakat'
  ]
  
  return title
    .toLowerCase()
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, '') // Özel karakterleri kaldır
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5) // Maksimum 5 kelime
}

// Kategori bazlı anahtar kelimeler
function getCategoryKeywords(category?: string): string[] {
  if (!category) return []
  
  const categoryMap: Record<string, string[]> = {
    'yapay-zeka': ['yapay zeka', 'ai', 'machine learning', 'derin öğrenme', 'neural network'],
    'blockchain': ['blockchain', 'kripto', 'bitcoin', 'ethereum', 'defi', 'nft'],
    'mobil': ['mobil', 'android', 'ios', 'uygulama', 'app development'],
    'web': ['web', 'frontend', 'backend', 'fullstack', 'javascript', 'react'],
    'bulut': ['bulut', 'cloud', 'aws', 'azure', 'google cloud', 'devops'],
    'güvenlik': ['güvenlik', 'cyber security', 'siber güvenlik', 'hacker', 'malware'],
    'oyun': ['oyun', 'game', 'unity', 'unreal engine', 'gaming', 'esports'],
    'iot': ['iot', 'nesnelerin interneti', 'akıllı ev', 'sensor', 'connected devices'],
    'ar-vr': ['ar', 'vr', 'augmented reality', 'virtual reality', 'metaverse'],
    'sosyal-medya': ['sosyal medya', 'instagram', 'facebook', 'twitter', 'linkedin', 'tiktok']
  }
  
  return categoryMap[category.toLowerCase()] || []
}

// Blog sayfası için SEO
export function setBlogPageSEO() {
  updatePageSEO({
    title: 'Blog | Teknoloji Menajeri - Teknoloji Haberleri',
    description: 'En güncel teknoloji haberleri, trend analizleri ve dijital dönüşüm yazıları. Teknoloji dünyasından son gelişmeler.',
    keywords: 'teknoloji blog, teknoloji haberleri, dijital dönüşüm, teknoloji trendleri',
    url: 'https://teknolojimenajeri.com/blog'
  })
}

// Ana sayfa için SEO
export function setHomePageSEO() {
  updatePageSEO({
    title: 'Teknoloji Menajeri - Sosyal Medya Ajansı | Blog & Teknoloji Haberleri',
    description: 'Teknoloji Menajeri - En güncel teknoloji haberleri, sosyal medya yönetimi ve dijital pazarlama hizmetleri.',
    keywords: 'teknoloji, sosyal medya, blog, dijital pazarlama, teknoloji haberleri, sosyal medya ajansı',
    url: 'https://teknolojimenajeri.com'
  })
}
