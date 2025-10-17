"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../lib/supabase/client"
import type { BlogPost } from "../../types/blog"
import { BlogEditor } from "./BlogEditor"
import { BlogPostList } from "./BlogPostList"
import { SubscribersList } from "./SubscribersList"
import { DigitalAnalysisRequests } from "./DigitalAnalysisRequests"
import { RecaptchaAnalytics } from "./RecaptchaAnalytics"
import { PenSquare, List, Users, LogOut, BarChart3, Shield } from 'lucide-react'

interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "new" | "edit" | "subscribers" | "analysis" | "recaptcha">("posts")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (data) {
      setPosts(data)
    }
    setLoading(false)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setActiveTab("edit")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return

    const supabase = createClient()
    await supabase.from("blog_posts").delete().eq("id", id)
    fetchPosts()
  }

  const handleSaveSuccess = () => {
    fetchPosts()
    setActiveTab("posts")
    setEditingPost(null)
  }

  const tabs = [
    { id: "posts" as const, label: "Tüm Yazılar", icon: List },
    { id: "new" as const, label: "Yeni Yazı", icon: PenSquare },
    { id: "subscribers" as const, label: "Aboneler", icon: Users },
    { id: "analysis" as const, label: "Dijital Analiz", icon: BarChart3 },
    { id: "recaptcha" as const, label: "reCAPTCHA", icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id === "new") setEditingPost(null)
                }}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id || (activeTab === "edit" && tab.id === "new")
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : activeTab === "posts" ? (
          <BlogPostList posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
        ) : activeTab === "subscribers" ? (
          <SubscribersList />
        ) : activeTab === "analysis" ? (
          <DigitalAnalysisRequests />
        ) : activeTab === "recaptcha" ? (
          <RecaptchaAnalytics />
        ) : (
          <BlogEditor post={editingPost} onSuccess={handleSaveSuccess} onCancel={() => setActiveTab("posts")} />
        )}
      </main>
    </div>
  )
}
