"use client"

import type { BlogPost } from "../../types/blog"
import { Edit, Trash2 } from "lucide-react"
import Loader from "../Loader"

interface BlogPostListProps {
  posts: BlogPost[]
  loading: boolean
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
}

export function BlogPostList({ posts, loading, onEdit, onDelete }: BlogPostListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Henüz blog yazısı yok</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{post.title}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {post.status === "published" ? "Yayında" : "Taslak"}
                </span>
              </div>
              {post.subtitle && <p className="text-slate-600 dark:text-slate-400 mb-2">{post.subtitle}</p>}
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("tr-TR")
                  : new Date(post.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Düzenle"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Sil"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
