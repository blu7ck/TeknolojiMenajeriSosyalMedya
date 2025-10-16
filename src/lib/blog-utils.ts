import Cookies from "js-cookie"

// Generate a unique user identifier for reaction tracking
export function getUserIdentifier(): string {
  const cookieName = "blog_user_id"
  let userId = Cookies.get(cookieName)

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    Cookies.set(cookieName, userId, { expires: 365 }) // 1 year
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
