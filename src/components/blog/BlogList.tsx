"use client"

import type { BlogPost } from "../../types/blog"
import { ArrowLeft, Calendar, Clock } from "lucide-react"

interface BlogListProps {
  posts: BlogPost[]
  month: string
  onBack: () => void
  onSelectPost: (post: BlogPost) => void
}

export function BlogList({ posts, month, onBack, onSelectPost }: BlogListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors group clickable"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Tüm aylar</span>
      </button>

      {/* Month Title */}
      <h2 className="text-4xl font-bold mb-12">{month}</h2>

      {/* Blog Posts Grid */}
      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.id} onClick={() => onSelectPost(post)} className="group cursor-pointer clickable">
            <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-xl">
              {/* Featured Image */}
              {post.cover_image && (
                <div className="relative overflow-hidden rounded-xl aspect-video md:aspect-square bg-muted">
                  <img
                    src={post.cover_image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.published_at!)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />5 dk okuma
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors text-balance">
                  {post.title}
                </h3>

                {post.excerpt && <p className="text-muted-foreground text-lg mb-4 text-pretty">{post.excerpt}</p>}

                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>Devamını oku</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
