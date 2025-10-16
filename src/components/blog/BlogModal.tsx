"use client"

import { useState, useEffect } from "react"
import type { BlogPost, ReactionCount } from "../../types/blog"
import { createClient } from "../../lib/supabase/client"
import { getUserIdentifier, getUserIP, trackBlogView } from "../../lib/blog-utils"
import { setBlogPostSEO } from "../../lib/seo-utils"
import { X, Calendar, Sparkles, Lightbulb, Flame, Moon, Sun } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface BlogModalProps {
  post: BlogPost
  onClose: () => void
}

export function BlogModal({ post, onClose }: BlogModalProps) {
  const [reactions, setReactions] = useState<ReactionCount>({
    inspired: 0,
    idea: 0,
    motivated: 0,
  })
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true) // Modal için ayrı dark mode

  useEffect(() => {
    fetchReactions()
    document.body.style.overflow = "hidden"
    
    // SEO ayarlarını güncelle
    setBlogPostSEO(post)
    
    // Blog view tracking
    trackBlogView(post.id)
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [post.id])

  const fetchReactions = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("blog_reactions")
      .select("reaction_type, user_identifier")
      .eq("blog_post_id", post.id)

    if (data) {
      const counts: ReactionCount = { inspired: 0, idea: 0, motivated: 0 }
      const userIdentifier = getUserIdentifier()
      const userReacted = new Set<string>()

      data.forEach((reaction) => {
        counts[reaction.reaction_type as keyof ReactionCount]++
        if (reaction.user_identifier === userIdentifier) {
          userReacted.add(reaction.reaction_type)
        }
      })

      setReactions(counts)
      setUserReactions(userReacted)
    }
  }

  const handleReaction = async (type: "inspired" | "idea" | "motivated") => {
    if (loading) return

    console.log("Reaction button clicked:", type)
    setLoading(true)
    const supabase = createClient()
    const userIdentifier = getUserIdentifier()
    const ipAddress = await getUserIP()
    
    console.log("User identifier:", userIdentifier)
    console.log("IP address:", ipAddress)

    try {
      if (userReactions.has(type)) {
        // Remove reaction
        console.log("Removing reaction:", type)
        const { error } = await supabase
          .from("blog_reactions")
          .delete()
          .eq("blog_post_id", post.id)
          .eq("user_identifier", userIdentifier)
          .eq("reaction_type", type)

        if (error) {
          console.error("Error removing reaction:", error)
        } else {
          setReactions((prev) => ({ ...prev, [type]: prev[type] - 1 }))
          setUserReactions((prev) => {
            const newSet = new Set(prev)
            newSet.delete(type)
            return newSet
          })
        }
      } else {
        // Add reaction
        console.log("Adding reaction:", type)
        const { error } = await supabase.from("blog_reactions").insert({
          blog_post_id: post.id,
          reaction_type: type,
          user_identifier: userIdentifier,
          ip_address: ipAddress,
        })

        if (error) {
          console.error("Error adding reaction:", error)
        } else {
          setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }))
          setUserReactions((prev) => new Set(prev).add(type))
        }
      }
    } catch (error) {
      console.error("Reaction error:", error)
    } finally {
      setLoading(false)
    }
  }

  const reactionButtons = [
    { type: "inspired" as const, icon: Sparkles, label: "ilham aldım", color: "text-yellow-500" },
    { type: "idea" as const, icon: Lightbulb, label: "fikir verdin", color: "text-blue-500" },
    { type: "motivated" as const, icon: Flame, label: "motive oldum", color: "text-red-500" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-gray-100 transition-colors z-10 clickable"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-gray-100 transition-colors z-10 clickable"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className={`p-8 sm:p-12 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          {/* Featured Image */}
          {post.cover_image && (
            <div className="relative overflow-hidden rounded-xl aspect-video mb-8 bg-muted">
              <img
                src={post.cover_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

              {/* Meta */}
              <div className={`flex items-center gap-2 mb-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.published_at!).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className={`text-4xl sm:text-5xl font-bold mb-4 text-balance ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{post.title}</h1>

              {/* Subtitle */}
              {post.excerpt && <p className={`text-xl mb-8 text-pretty ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{post.excerpt}</p>}

              {/* Content */}
              <div className={`prose prose-lg max-w-none mb-12 break-words overflow-wrap-anywhere markdown-content ${isDarkMode ? 'prose-invert' : 'prose-gray'}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>

          {/* Reactions */}
          <div className={`border-t pt-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bu yazı sana nasıl hissettirdi?</h3>
            <div className="flex flex-wrap gap-3">
              {reactionButtons.map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all clickable ${
                    userReactions.has(type)
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDarkMode 
                        ? "bg-gray-800 border-gray-600 hover:border-gray-500 text-white"
                        : "bg-white border-gray-300 hover:border-gray-400 text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${userReactions.has(type) ? "" : color}`} />
                  <span className="font-medium">{label}</span>
                  <span className={`text-sm ${userReactions.has(type) ? 'text-blue-100' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({reactions[type]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
