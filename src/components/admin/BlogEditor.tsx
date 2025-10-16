"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../lib/supabase/client"
import type { BlogPost } from "../../types/blog"
import { Save, X, Eye, Upload, Image as ImageIcon } from 'lucide-react'

interface BlogEditorProps {
  post: BlogPost | null
  onSuccess: () => void
  onCancel: () => void
}

export function BlogEditor({ post, onSuccess, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    customCategory: "",
    tags: "",
    status: "draft" as "draft" | "published",
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content,
        cover_image: post.cover_image || "",
        category: post.category || "",
        customCategory: post.category && !['genel', 'yapay-zeka', 'blockchain', 'mobil', 'web', 'bulut', 'güvenlik', 'oyun', 'iot', 'ar-vr', 'sosyal-medya'].includes(post.category) ? post.category : "",
        tags: post.tags?.join(", ") || "",
        status: post.status,
      })
    }
  }, [post])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya boyut kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Görsel boyutu en fazla 5MB olabilir!')
      return
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Sadece görsel dosyaları yükleyebilirsiniz!')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const supabase = createClient()
      
      // Benzersiz dosya adı oluştur
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = fileName

      console.log('Görsel yükleniyor...', filePath)

      // Dosyayı yükle
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload hatası:', error)
        alert(`Yükleme hatası: ${error.message}`)
        setUploading(false)
        return
      }

      // Public URL'yi al
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      console.log('Görsel yüklendi:', publicUrl)

      // Form'a URL'yi ekle
      setFormData({ ...formData, cover_image: publicUrl })
      setUploadProgress(100)
      
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)

    } catch (error) {
      console.error('Yükleme hatası:', error)
      alert(`Bir hata oluştu: ${error}`)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Kategori logic'i: custom seçilmişse customCategory'yi kullan, değilse normal category'yi kullan
      const finalCategory = formData.category === 'custom' 
        ? (formData.customCategory || null)
        : (formData.category || null)

      const data = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        excerpt: formData.excerpt || null,
        content: formData.content,
        cover_image: formData.cover_image || null,
        category: finalCategory,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null,
        status: formData.status,
        published_at: formData.status === "published" && !post?.published_at ? new Date().toISOString() : post?.published_at,
      }

      console.log('Gönderilen veri:', data)

      let result
      if (post) {
        result = await supabase.from("blog_posts").update(data).eq("id", post.id).select().single()
      } else {
        result = await supabase.from("blog_posts").insert(data).select().single()
      }

      console.log('Supabase yanıtı:', result)

      if (result.error) {
        console.error('Supabase hatası:', result.error)
        alert(`Hata: ${result.error.message}`)
        setLoading(false)
        return
      }

      // Eğer yazı published ise, email tetikle
      if (formData.status === "published") {
        try {
          const postData = result.data
          if (postData) {
            console.log("📧 Blog yazısı kaydedildi, email tetikleniyor:", postData.title)
            console.log("📧 Post ID:", postData.id)
            
            const emailResponse = await supabase.functions.invoke("send-new-post-notification", {
              body: { postId: postData.id }
            })
            
            console.log("📧 Email response:", emailResponse)
            console.log("✅ Blog yazısı email'i gönderildi")
          } else {
            console.log("❌ Post data bulunamadı:", result)
          }
        } catch (emailError) {
          console.log("❌ Email gönderilemedi:", emailError)
          // Email hatası olsa bile yazı kaydedilmiş sayılır
        }
      } else {
        console.log("📝 Blog yazısı kaydedildi ama published değil, email gönderilmiyor")
      }

      alert('Blog yazısı başarıyla kaydedildi!')
      setLoading(false)
      onSuccess()
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert(`Bir hata oluştu: ${error}`)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{post ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}</h2>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            {preview ? "Düzenle" : "Önizle"}
          </button>
        </div>

        {preview ? (
          <div className="prose prose-lg max-w-none">
            <h1>{formData.title}</h1>
            {formData.excerpt && <p className="lead">{formData.excerpt}</p>}
            {formData.cover_image && <img src={formData.cover_image || "/placeholder.svg"} alt={formData.title} />}
            <div className="whitespace-pre-wrap">{formData.content}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yazı başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Özet / Kısa Açıklama</label>
              <input
                type="text"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kısa açıklama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Kategori seçin</option>
                <option value="genel">Genel</option>
                <option value="yapay-zeka">Yapay Zeka</option>
                <option value="blockchain">Blockchain</option>
                <option value="mobil">Mobil</option>
                <option value="web">Web</option>
                <option value="bulut">Bulut</option>
                <option value="güvenlik">Güvenlik</option>
                <option value="oyun">Oyun</option>
                <option value="iot">IoT</option>
                <option value="ar-vr">AR/VR</option>
                <option value="sosyal-medya">Sosyal Medya</option>
                {/* Eğer custom kategori varsa onu da göster */}
                {formData.customCategory && formData.category !== 'custom' && (
                  <option value="custom">{formData.customCategory} (Özel)</option>
                )}
                <option value="custom">Özel Kategori (Manuel)</option>
              </select>
            </div>

            {/* Manuel kategori ekleme alanı */}
            {formData.category === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Özel Kategori Adı</label>
                <input
                  type="text"
                  value={formData.customCategory || ''}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Özel kategori adını girin"
                />
                <p className="text-sm text-gray-500 mt-1">Bu kategori otomatik olarak seçeneklere eklenecek.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler (Tags)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="react, javascript, frontend (virgülle ayırın)"
              />
              <p className="text-sm text-gray-500 mt-1">Etiketleri virgülle ayırın. SEO için otomatik anahtar kelime oluşturulacak.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
              
              {/* Görsel Önizleme */}
              {formData.cover_image && (
                <div className="mb-4 relative">
                  <img 
                    src={formData.cover_image} 
                    alt="Kapak görseli önizleme" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: "" })}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Butonu */}
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-all ${
                    uploading 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}>
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-sm text-blue-600">Yükleniyor... {uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Görsel Yükle</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                
                {/* Veya URL ile ekle */}
                <div className="flex-1">
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="veya URL yapıştır"
                    />
                  </div>
                </div>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Görsel yükle veya URL gir • Max 5MB • JPG, PNG, WebP
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İçerik * (Markdown destekli)</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Markdown formatında yazı içeriği..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınla</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
