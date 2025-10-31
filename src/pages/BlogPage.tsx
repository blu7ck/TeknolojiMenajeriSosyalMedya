"use client"

import { useState, useEffect } from "react"
import { createClient } from "../lib/supabase/client"
import { setBlogPageSEO } from "../lib/seo-utils"
import type { BlogPost } from "../types/blog"
import { groupPostsByMonth } from "../lib/blog-utils"
import { MonthlyCards } from "../components/blog/MonthlyCards"
import { BlogList } from "../components/blog/BlogList"
import { BlogModal } from "../components/blog/BlogModal"
import { NewsletterForm } from "../components/blog/NewsletterForm"

export default function BlogPage() {
  const [isDark] = useState(true)
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
      <div className="min-h-screen bg-[#F2F4F7] text-[#1F2933] transition-colors duration-300">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-red-500/25 bg-[#151516]/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-3 text-white">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="/"
                className="clickable w-full rounded-lg border border-white/25 px-4 py-2 text-center text-sm font-semibold transition-all duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
              >
                S0C1ETY
              </a>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300 sm:text-sm sm:tracking-[0.35em]">#Blog</span>
              <a
                href="https://teknolojimenajeri.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="clickable w-full rounded-lg border border-red-400 px-4 py-2 text-center text-sm font-semibold text-red-200 transition-all duration-300 hover:border-red-200 hover:bg-red-500/20 hover:text-white sm:w-auto"
              >
                Teknoloji Menajeri
              </a>
            </div>
          </div>
        </nav>

        {/* Year Selector */}
        {/* Year Selector */}
        {availableYears.length > 1 && (
          <>
            <div className="fixed top-32 right-6 z-40 hidden md:block">
              <div className="rounded-lg border border-gray-300 bg-[#DBDBDB] p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                <select
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value || null)}
                  className="clickable rounded-lg border-0 bg-transparent p-2 text-sm font-medium text-gray-700 focus:outline-none dark:text-gray-300"
                >
                  <option value="">📅 Tüm Yıllar</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>📅 {year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mx-auto mt-6 w-full max-w-7xl px-4 md:hidden">
              <label className="sr-only" htmlFor="mobile-year-select">Yıl seçimi</label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-[#DBDBDB] p-2 shadow-md">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">Yıl</span>
                <select
                  id="mobile-year-select"
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value || null)}
                  className="clickable w-full rounded-md border-0 bg-transparent px-2 py-1 text-sm font-medium text-gray-800 focus:outline-none"
                >
                  <option value="">📅 Tüm Yıllar</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>📅 {year}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="px-4 pb-44 pt-40 sm:px-6 sm:pt-40 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1
                className="inline-block whitespace-nowrap text-[20px] sm:text-[24px] lg:text-[28px] italic text-[#0F172A]/90"
                style={{ fontFamily: '"Caveat", "Patrick Hand", "Segoe Script", "Comic Sans MS", cursive' }}
              >
                Dijital dünyada başarıya giden yolculuğunuzda size ilham verecek içerikler
              </h1>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-400 border-t-transparent"></div>
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
        <div className="fixed bottom-0 left-0 right-0 shadow-lg z-50" style={{ backgroundColor: "#151516" }}>
          <div className="w-full px-0">
            <NewsletterForm isDark={isDark} />
          </div>
        </div>

        {/* Blog Modal */}
        {selectedPost && <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </div>
    </div>
  )
}
