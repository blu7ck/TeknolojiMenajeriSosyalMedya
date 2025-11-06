"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Calendar, Sparkles, Lightbulb, Flame, ArrowLeft } from "lucide-react"

import type { BlogPost, ReactionCount } from "../types/blog"
import { createClient } from "../lib/supabase/client"
import { getUserIdentifier, getUserIP, trackBlogView } from "../lib/blog-utils"
import { setBlogPostSEO } from "../lib/seo-utils"
import { SubscribeDrawer } from "../components/blog/SubscribeDrawer"
import { ThemeToggle } from "../components/blog/ThemeToggle"
import Loader from "../components/Loader"

type BlogNavigationState = {
  month?: string | null
  year?: string | null
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = (location.state as BlogNavigationState | null) ?? null

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [reactions, setReactions] = useState<ReactionCount>({
    inspired: 0,
    idea: 0,
    motivated: 0,
  })
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [isReactionLoading, setIsReactionLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchPost() {
      if (!slug) {
        setError("Blog yazısı bulunamadı.")
        setLoading(false)
        return
      }

      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single()

      if (!isMounted) return

      if (fetchError || !data) {
        console.error("Blog post fetch error:", fetchError)
        setError("İstediğiniz blog yazısı bulunamadı veya yayından kaldırıldı.")
        setPost(null)
      } else {
        setPost(data)
        setError(null)
      }

      setLoading(false)
    }

    fetchPost()

    return () => {
      isMounted = false
    }
  }, [slug])

  const fetchReactions = useCallback(async (postId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("blog_reactions")
      .select("reaction_type, user_identifier")
      .eq("blog_post_id", postId)

    if (error) {
      console.error("Reactions fetch error:", error)
      return
    }

    if (data) {
      const counts: ReactionCount = { inspired: 0, idea: 0, motivated: 0 }
      const userIdentifier = getUserIdentifier()
      const userReacted = new Set<string>()

      data.forEach((reaction: { reaction_type: string; user_identifier: string }) => {
        counts[reaction.reaction_type as keyof ReactionCount]++
        if (reaction.user_identifier === userIdentifier) {
          userReacted.add(reaction.reaction_type)
        }
      })

      setReactions(counts)
      setUserReactions(userReacted)
    }
  }, [])

  useEffect(() => {
    if (!post) return

    setBlogPostSEO(post)
    void trackBlogView(post.id)
    void fetchReactions(post.id)
  }, [post, fetchReactions])

  const handleReaction = useCallback(async (type: "inspired" | "idea" | "motivated") => {
    if (!post || isReactionLoading) return

    setIsReactionLoading(true)
    const supabase = createClient()
    const userIdentifier = getUserIdentifier()
    const ipAddress = await getUserIP()

    try {
      if (userReactions.has(type)) {
        const { error } = await supabase
          .from("blog_reactions")
          .delete()
          .eq("blog_post_id", post.id)
          .eq("user_identifier", userIdentifier)
          .eq("reaction_type", type)

        if (error) {
          console.error("Reaction remove error:", error)
        } else {
          setReactions((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))
          setUserReactions((prev) => {
            const next = new Set(prev)
            next.delete(type)
            return next
          })
        }
      } else {
        const { error } = await supabase.from("blog_reactions").insert({
          blog_post_id: post.id,
          reaction_type: type,
          user_identifier: userIdentifier,
          ip_address: ipAddress,
        })

        if (error) {
          console.error("Reaction add error:", error)
        } else {
          setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }))
          setUserReactions((prev) => new Set(prev).add(type))
        }
      }
    } catch (reactionError) {
      console.error("Reaction handler error:", reactionError)
    } finally {
      setIsReactionLoading(false)
    }
  }, [post, isReactionLoading, userReactions])

  const reactionButtons = useMemo(() => ([
    { type: "inspired" as const, icon: Sparkles, label: "ilham aldım", color: "text-yellow-500" },
    { type: "idea" as const, icon: Lightbulb, label: "fikir verdin", color: "text-blue-500" },
    { type: "motivated" as const, icon: Flame, label: "motive oldum", color: "text-red-500" },
  ]), [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D3DADD]">
        <Loader />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#D3DADD] px-4 text-center">
        <p className="text-xl text-gray-700 mb-6">{error || "İstediğiniz blog yazısı bulunamadı."}</p>
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#151516] text-white hover:bg-black transition-colors clickable"
        >
          <ArrowLeft className="w-4 h-4" />
          Blog sayfasına dön
        </button>
      </div>
    )
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`min-h-screen transition-colors duration-300 pb-32 ${
          isDarkMode ? "bg-[#0B0B0F] text-white" : "bg-[#F2F4F7] text-[#1F2933]"
        }`}
      >
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-red-500/25 bg-[#151516]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-white">
            <button
              onClick={() => {
                if (navigationState?.month) {
                  navigate("/blog", {
                    state: {
                      month: navigationState.month,
                      year: navigationState.year ?? null,
                    },
                  })
                } else {
                  navigate("/blog")
                }
              }}
              className="flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium transition-colors hover:border-white hover:bg-white/10 clickable"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </button>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300 sm:text-sm sm:tracking-[0.35em]">
              Teknoloji Menajeri
            </span>
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode((prev) => !prev)} />
          </div>
        </nav>

        <SubscribeDrawer />

        <main className="px-4 pt-32 pb-12 transition-colors duration-300">
          <article className="mx-auto w-full max-w-3xl">
            <header className="mb-12">
              <h1 className={`text-balance text-4xl font-bold sm:text-5xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {post.title}
              </h1>
              {formattedDate && (
                <div className={`mt-3 flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {post.excerpt && (
                <p className={`mt-6 text-xl leading-relaxed text-pretty ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {post.excerpt}
                </p>
              )}
            </header>

            {post.cover_image && (
              <div className="relative mb-10 overflow-hidden rounded-2xl border border-black/5 shadow-xl dark:border-white/10">
                <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div
              className={`markdown-content prose prose-lg max-w-none mb-16 ${
                isDarkMode ? "prose-invert" : "prose-gray"
              }`}
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            <section className={`border-t pt-8 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h2 className={`mb-4 text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Bu yazı sana nasıl hissettirdi?
              </h2>
              <div className="flex flex-wrap gap-3">
                {reactionButtons.map(({ type, icon: Icon, label, color }) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    disabled={isReactionLoading}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all clickable ${
                      userReactions.has(type)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isDarkMode
                          ? "border-gray-600 bg-gray-800 text-white hover:border-gray-500"
                          : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${userReactions.has(type) ? "" : color}`} />
                    <span className="font-medium">{label}</span>
                    <span
                      className={`text-sm ${
                        userReactions.has(type)
                          ? "text-blue-100"
                          : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                      }`}
                    >
                      ({reactions[type]})
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </article>
        </main>

      </div>
    </div>
  )
}


