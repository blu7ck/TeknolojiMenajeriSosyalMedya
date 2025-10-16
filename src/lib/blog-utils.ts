import Cookies from "js-cookie"

// Generate a unique user identifier for reaction tracking
export function getUserIdentifier(): string {
  const cookieName = "blog_user_id"
  let userId = Cookies.get(cookieName)

  // Fallback: localStorage'dan kontrol et
  if (!userId) {
    userId = localStorage.getItem(cookieName) || undefined
  }

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Cookie domain ayarları - Vercel için güvenli
    const cookieOptions = {
      expires: 365,
      secure: true,
      sameSite: 'lax' as const,
      path: '/'
    }
    
    try {
      Cookies.set(cookieName, userId, cookieOptions)
      // localStorage'a da kaydet (fallback için)
      localStorage.setItem(cookieName, userId)
    } catch (error) {
      console.warn("Cookie set failed, using localStorage:", error)
      // Sadece localStorage kullan
      localStorage.setItem(cookieName, userId)
    }
  }

  return userId
}

// Get user's IP address (client-side approximation)
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("Failed to get IP:", error)
    return "unknown"
  }
}

// Format date for monthly grouping
export function getMonthYear(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long" })
}

// Group blog posts by month
export function groupPostsByMonth(posts: any[]): Record<string, any[]> {
  return posts.reduce(
    (acc, post) => {
      const monthYear = getMonthYear(post.published_at)
      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(post)
      return acc
    },
    {} as Record<string, any[]>,
  )
}

// Track blog post view
export async function trackBlogView(blogPostId: string): Promise<void> {
  try {
    const { createClient } = await import("./supabase/client")
    const supabase = createClient()
    const userIdentifier = getUserIdentifier()
    const ipAddress = await getUserIP()
    
    // Check if user already viewed this post today
    const today = new Date().toISOString().split('T')[0]
    const { data: existingViews, error: checkError } = await supabase
      .from("blog_post_views")
      .select("id")
      .eq("post_id", blogPostId)
      .eq("user_identifier", userIdentifier)
      .gte("viewed_at", `${today}T00:00:00.000Z`)
    
    // Check for query errors
    if (checkError) {
      console.error("Error checking existing views:", checkError)
      return
    }
    
    // Only track if not viewed today
    if (!existingViews || existingViews.length === 0) {
      const { error } = await supabase
        .from("blog_post_views")
        .insert({
          post_id: blogPostId,
          user_identifier: userIdentifier,
          ip_address: ipAddress
        })
      
      if (error) {
        console.error("Error tracking blog view:", error)
      } else {
        console.log("Blog view tracked successfully:", blogPostId)
      }
    } else {
      console.log("Blog already viewed today, skipping:", blogPostId)
    }
  } catch (error) {
    console.error("Failed to track blog view:", error)
  }
}