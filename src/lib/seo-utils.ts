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
}) {
  const baseUrl = 'https://teknolojimenajeri.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`
  
  updatePageSEO({
    title: `${post.title} | Teknoloji Menajeri Blog`,
    description: post.excerpt || `Teknoloji Menajeri blog yazısı: ${post.title}`,
    keywords: `teknoloji, blog, ${post.title.toLowerCase()}, teknoloji menajeri`,
    image: post.cover_image || 'https://i.ibb.co/CstJSnMp/logo.png',
    url: postUrl,
    type: 'article'
  })
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
