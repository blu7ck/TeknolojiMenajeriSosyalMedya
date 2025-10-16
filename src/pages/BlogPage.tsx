"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { createClient } from "../lib/supabase/client"
import { setBlogPageSEO } from "../lib/seo-utils"
import type { BlogPost } from "../types/blog"
import { groupPostsByMonth } from "../lib/blog-utils"
import { MonthlyCards } from "../components/blog/MonthlyCards"
import { BlogList } from "../components/blog/BlogList"
import { BlogModal } from "../components/blog/BlogModal"
import { NewsletterForm } from "../components/blog/NewsletterForm"
import { Calendar } from "lucide-react"

export function BlogPage() {
  const [isDark, setIsDark] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
    setBlogPageSEO()
  }, [])

  const fetchPosts = async () => {
    try {
      console.log("🔄 Blog posts fetching started...")
      const supabase = createClient()
      console.log("✅ Supabase client created")
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })

      console.log("📊 Supabase response:", { data, error })

      if (error) {
        console.error("❌ Supabase error:", error)
      } else {
        console.log("✅ Blog posts fetched:", data?.length || 0, "posts")
        setPosts(data || [])
      }
    } catch (err) {
      console.error("❌ Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Yıl filtresi uygula
  const filteredPosts = selectedYear 
    ? posts.filter(post => new Date(post.published_at!).getFullYear().toString() === selectedYear)
    : posts
    
  const groupedPosts = groupPostsByMonth(filteredPosts)
  const monthsWithPosts = Object.keys(groupedPosts)
  
  // Yıllara göre gruplama
  const groupPostsByYear = (posts: BlogPost[]) => {
    const grouped: Record<string, BlogPost[]> = {}
    posts.forEach(post => {
      const year = new Date(post.published_at!).getFullYear().toString()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(post)
    })
    return grouped
  }
  
  const groupedPostsByYear = groupPostsByYear(posts)
  const availableYears = Object.keys(groupedPostsByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />

        {/* Year Selector */}
        {availableYears.length > 1 && (
          <div className="fixed top-32 right-8 z-40">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2">
              <select
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(e.target.value || null)}
                className="p-2 rounded-lg bg-transparent border-0 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none clickable"
              >
                <option value="">📅 Tüm Yıllar</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>📅 {year}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="pt-32 px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '80px' }}>
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">Teknoloji Menajeri Blog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Dijital dünyada başarıya giden yolculuğunuzda size ilham verecek içerikler
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : selectedMonth ? (
              <BlogList
                posts={groupedPosts[selectedMonth]}
                month={selectedMonth}
                onBack={() => setSelectedMonth(null)}
                onSelectPost={setSelectedPost}
              />
            ) : (
              <MonthlyCards months={monthsWithPosts} postsCount={groupedPosts} onSelectMonth={setSelectedMonth} />
            )}
          </div>
        </div>

        {/* Fixed Newsletter Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
          <div className="container mx-auto px-4">
            <NewsletterForm isDark={isDark} />
          </div>
        </div>

        {/* Blog Modal */}
        {selectedPost && <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </div>
    </div>
  )
}
