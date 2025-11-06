"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { createClient } from "../lib/supabase/client"
import { setBlogPageSEO } from "../lib/seo-utils"
import type { BlogPost } from "../types/blog"
import { groupPostsByMonth } from "../lib/blog-utils"
import { MonthlyCards } from "../components/blog/MonthlyCards"
import { BlogList } from "../components/blog/BlogList"
import { SubscribeDrawer } from "../components/blog/SubscribeDrawer"
import Loader from "../components/Loader"

type BlogNavigationState = {
  month?: string | null
  year?: string | null
}

const StudioButtonWrapper = styled.div`
  .button {
    position: relative;
    border: none;
    background: transparent;
    --stroke-color: #ffffff7c;
    --ani-color: rgba(95, 3, 244, 0);
    --color-gar: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    letter-spacing: 3px;
    font-size: 2em;
    font-family: "Arial", sans-serif;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--stroke-color);
    cursor: pointer;
  }

  .front-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    background: var(--color-gar);
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 200%;
    overflow: hidden;
    transition: all 1s;
    animation: 8s ani infinite;
    border-bottom: 2px solid transparent;
  }

  .button:hover .front-text {
    width: 100%;
    border-bottom: 2px solid #03a9f4;
    -webkit-text-stroke: 1px var(--ani-color);
  }

  @keyframes ani {
    0% {
      background-position: 0%;
    }
    50% {
      background-position: 400%;
    }
    100% {
      background-position: 0%;
    }
  }
`

export default function BlogPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDark] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const navigationStateApplied = useRef(false)

  useEffect(() => {
    fetchPosts()
    setBlogPageSEO()
  }, [])

  useEffect(() => {
    if (navigationStateApplied.current) return

    const navigationState = (location.state as BlogNavigationState | null) ?? null

    if (!navigationState) {
      navigationStateApplied.current = true
      return
    }

    if (navigationState.year !== undefined) {
      setSelectedYear(navigationState.year ?? null)
    }

    if (navigationState.month) {
      setSelectedMonth(navigationState.month)
    }

    navigationStateApplied.current = true
  }, [location.state])

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
  const monthPosts = selectedMonth ? groupedPosts[selectedMonth] : undefined
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
      <div className="min-h-screen overflow-x-hidden bg-[#F2F4F7] text-[#1F2933] transition-colors duration-300">
        <nav className="fixed top-0 left-0 right-0 z-50 pt-4">
          <div className="mx-auto max-w-7xl px-4">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-black/60 backdrop-blur-xl shadow-xl">
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              <div className="relative flex flex-col items-center gap-4 px-6 py-4 text-white sm:flex-row sm:justify-between">
                <div className="flex items-center gap-3">
                  <StudioButtonWrapper>
                    <button
                      type="button"
                      className="button clickable"
                      data-text="Studio"
                      aria-label="Studio platformunu yeni sekmede aç"
                      title="Studio platformunu yeni sekmede aç"
                      onClick={() => window.open("https://studio.teknolojimenajeri.com", "_blank", "noopener,noreferrer")}
                    >
                      <span className="actual-text">&nbsp;Studio&nbsp;</span>
                      <span aria-hidden="true" className="front-text">&nbsp;Studio&nbsp;</span>
                    </button>
                  </StudioButtonWrapper>
                </div>

                <p className="text-[10px] leading-tight text-center uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                  <span className="block">Dijital dünyada başarıya giden yolculuğunuzda</span>
                  <span className="block">size ilham verecek içerikler</span>
                </p>

                <a
                  href="https://teknolojimenajeri.com.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 shadow-md transition-all duration-300 hover:border-white/40 hover:bg-white/20 hover:text-white hover:shadow-lg clickable"
                >
                  Teknoloji Menajeri
                </a>
              </div>
            </div>
          </div>
        </nav>

        <SubscribeDrawer />

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
            
            

            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <Loader />
              </div>
            ) : selectedMonth && monthPosts ? (
              <BlogList
                posts={monthPosts}
                month={selectedMonth}
                onBack={() => setSelectedMonth(null)}
                onSelectPost={(post, monthLabel) =>
                  navigate(`/blog/${post.slug}`, {
                    state: {
                      month: monthLabel,
                      year: selectedYear ?? null,
                    },
                  })
                }
              />
            ) : (
              <MonthlyCards months={monthsWithPosts} postsCount={groupedPosts} onSelectMonth={setSelectedMonth} />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
