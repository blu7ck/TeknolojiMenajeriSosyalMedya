"use client"

import type React from "react"

import { useState } from "react"
import { Check, X, Play, ArrowLeft } from "lucide-react"
import "./PackageSelector.css"

interface Module {
  id: string
  name: string
  description?: string
  mediaUrl?: string
  exampleJson?: string
  price?: string
}

interface Package {
  id: string
  title: string
  description: string
  target: string
  modules: Module[]
}

const packages: Package[] = [
  {
    id: "individual",
    title: "Bireysel",
    description: "Kişisel hesaplar için profesyonel görünüm",
    target:
      "Sosyal medyayı daha düzenli, estetik ve profesyonel kullanmak isteyen bireyler, kişisel marka oluşturmak isteyenler, hobi içerik üreticileri",
    modules: [
      {
        id: "fenomen-paket",
        name: "Fenomen Paket",
        description: "Mentorluk + İçerik Üretimi ",
        mediaUrl: "https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/test4.mp4",
        exampleJson: "Profesyonel Seviyede 12 Fotoğraf ve 2 Video | Sosyal Medya Eğitimi",
        price: "₺2,500",
      },
      {
        id: "kisiye-ozel-icerik",
        name: "Kişiye Özel İçerik Üretimi",
        description: "Görsel",
        mediaUrl: "https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/test4.mp4",
        exampleJson: "4 Adet Görsel",
        price: "₺800",
      },
      {
        id: "mini-video",
        name: "Mini Video (Reel)",
        description: "Anılarınızı canlandırabilir, hayallerinizi gerçekleştirebilirsiniz :)",
        mediaUrl: "https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/test4.mp4",
        exampleJson: '{"deliverables": "1 Adet Video"}',
        price: "₺1,200",
      },
      {
        id: "trend-ai-icerikler",
        name: "Trend AI İçerikler",
        description: "Sosyal Medya Viral İçerikleri",
        exampleJson: '{"deliverables": "Görsel | Video"}',
        price: "₺600",
      },
    ],
  },
  {
    id: "influencer",
    title: "Influencer",
    description: "İçerik üreticileri ve marka işbirlikleri için",
    target:
      "Gelir elde eden veya gelir hedefleyen içerik üreticileri, markalarla işbirliği yapanlar veya işbirliği sürecine hazırlananlar",
    modules: [
      {
        id: "influencer-baslangic",
        name: "Infiluencer Başlangıç Paketi",
        description: "Danışmanlık + Profil Yönetimi + İçerik Takvimi + İçerik Üretimi + Hedef Kitle Analizi",
        exampleJson:
          '{"deliverables": "Aylık 2 Saat Danışmanlık Hizmeti + Profesyonel Seviyede 20 Fotoğraf + 4 Video + Anlık İletişim Hizmeti"}',
        price: "₺4,500",
      },
      {
        id: "marka-isbirligi",
        name: "Marka İşbirliği İçerik Üretimi",
        description: "Görsel + Caption + Hashtag | Video + Caption + Hashtag",
        exampleJson: '{"deliverables": "Görsel | Video"}',
        price: "₺1,800",
      },
      {
        id: "mini-video-platform",
        name: "Mini Video (Platform Uyumlu)",
        description: "Kısa video",
        exampleJson: '{"deliverables": "1 Adet Video"}',
        price: "₺1,500",
      },
      {
        id: "ugc-seti",
        name: "UGC Seti",
        description: "İstenilen Stilde",
        exampleJson: '{"deliverables": "1 Adet UGC Video"}',
        price: "₺2,000",
      },
    ],
  },
  {
    id: "corporate",
    title: "Kurumsal",
    description: "KOBİ'den kurumsala tam çözüm",
    target:
      "KOBİ'den kurumsala kadar işletmeler, marka yönetimi, satış odaklı sosyal medya, SEO ve dijital büyüme hedefleri",
    modules: [
      {
        id: "sosyal-medya-yonetimi",
        name: "Sosyal Medya Yönetimi",
        description: "Hesapların tam kapsamlı yönetimi",
        exampleJson: '{"deliverables": "1-3 platform yönetimi"}',
        price: "₺3,500",
      },
      {
        id: "video-icerik-uretimi",
        name: "Video İçerik Üretimi",
        description: "Yapay Zeka destekli veya UE5 profesyonel video",
        exampleJson: '{"deliverables": "1 Adet Video"}',
        price: "₺2,800",
      },
      {
        id: "web-sitesi-tasarimi",
        name: "Web Sitesi Tasarımı",
        description: "Kurumsal veya e-ticaret site",
        exampleJson: '{"deliverables": "Website"}',
        price: "₺5,000",
      },
      {
        id: "kisisel-marka-danismanligi",
        name: "Kişisel Marka Danışmanlığı",
        description: "1 Saatlik Online Oturum",
        exampleJson: '{"deliverables": "Rapor"}',
        price: "₺1,000",
      },
    ],
  },
]

export function PackageSelector() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedModules, setSelectedModules] = useState<Record<string, string[]>>({})
  const [hoveredModule, setHoveredModule] = useState<Module | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyInfo: "",
    socialMedia: [
      { platform: "instagram", username: "" },
      { platform: "tiktok", username: "" },
      { platform: "facebook", username: "" },
      { platform: "linkedin", username: "" },
      { platform: "twitter", username: "" },
    ],
  })
  const [hoverPosition, setHoverPosition] = useState<"left" | "right">("right")

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedPackage(null)
    }
  }

  const toggleModule = (packageId: string, moduleId: string) => {
    setSelectedModules((prev) => {
      const current = prev[packageId] || []
      const updated = current.includes(moduleId) ? current.filter((id) => id !== moduleId) : [...current, moduleId]
      return { ...prev, [packageId]: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPkg = packages.find((p) => p.id === selectedPackage)
    const modules = selectedModules[selectedPackage || ""] || []

    try {
      // Save to database first
      const { createClient } = await import('../lib/supabase/client')
      const supabase = createClient()

      // Get module names from IDs
      const moduleNames = modules.map((moduleId: string) => {
        const module = selectedPkg?.modules.find((m: any) => m.id === moduleId)
        return module?.name || moduleId
      })

      // Filter social media accounts that have usernames
      const socialMediaAccounts = formData.socialMedia.filter((social: any) => social.username.trim())

      // Insert package request
      const { data: requestData, error: dbError } = await supabase
        .from('package_requests')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company_info: formData.companyInfo || null,
          package_type: selectedPackage,
          package_title: selectedPkg?.title,
          selected_modules: moduleNames,
          social_media_accounts: socialMediaAccounts,
          status: 'pending'
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to save package request')
      }

      // Send email notification via Supabase Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          type: 'package_request',
          to: 'furkan@fixurelabs.dev,mucahit@fixurelabs.dev',
          data: {
            package: selectedPkg?.title,
            modules: moduleNames,
            formData,
            requestId: requestData.id
          },
        }),
      })

      if (response.ok) {
        alert("Teklifiniz alındı! En kısa sürede size dönüş yapacağız.")
        setShowForm(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyInfo: "",
          socialMedia: [
            { platform: "instagram", username: "" },
            { platform: "tiktok", username: "" },
            { platform: "facebook", username: "" },
            { platform: "linkedin", username: "" },
            { platform: "twitter", username: "" },
          ],
        })
      } else {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.")
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  const updateSocialMedia = (index: number, field: 'platform' | 'username', value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📷'
      case 'tiktok': return '🎵'
      case 'facebook': return '👥'
      case 'linkedin': return '💼'
      case 'twitter': return '🐦'
      default: return '📱'
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'Instagram'
      case 'tiktok': return 'TikTok'
      case 'facebook': return 'Facebook'
      case 'linkedin': return 'LinkedIn'
      case 'twitter': return 'X (Twitter)'
      default: return platform
    }
  }

  const getMediaType = (url: string): "image" | "video" | null => {
    if (!url) return null
    const extension = url.split(".").pop()?.toLowerCase()
    if (["gif", "jpg", "jpeg", "png", "webp", "svg"].includes(extension || "")) return "image"
    if (["mp4", "webm", "mov", "ogg"].includes(extension || "")) return "video"
    return null
  }

  return (
    <div className="py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Neler Yapıyoruz?</h2>
          <p className="text-xl text-gray-400">Seç · Özelleştir · Parla</p>
        </div>

        <div
          className="relative transition-all duration-700 ease-in-out"
          style={{
            transform: showForm ? "translateX(-100%)" : "translateX(0)",
            opacity: showForm ? 0 : 1,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-start perspective-1000" onClick={handleContainerClick}>
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id

              return (
                <div
                  key={pkg.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPackage(isSelected ? null : pkg.id)
                  }}
                  className={`
                    relative w-full h-[280px] md:h-[320px] cursor-pointer transition-transform duration-700
                    ${isSelected ? "rotate-y-180" : ""}
                  `}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: isSelected ? 20 : 1
                  }}
                >
                  {/* Kartın Ön Yüzü */}
                  <div 
                    className="absolute inset-0 rounded-2xl p-6 flex flex-col bg-black/80 border border-red-500/30 hover:border-red-500/60 hover:bg-black/90 transition-all duration-300"
                    style={{
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <div className="mb-4 min-h-0">
                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{pkg.description}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{pkg.target}</p>
                    </div>
                  </div>

                  {/* Kartın Arka Yüzü */}
                  <div 
                    className="absolute inset-0 rounded-2xl p-6 flex flex-col bg-black/95 backdrop-blur-sm border-2 border-red-500 shadow-2xl shadow-red-500/40"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <Check className="w-5 h-5 text-white" />
                    </div>

                    <div className="space-y-1 animate-fade-in">
                      <div className="text-sm font-semibold text-gray-300 mb-1">Modüller:</div>
                      {pkg.modules.map((module) => {
                        const isModuleSelected = Boolean(selectedModules[pkg.id]?.includes(module.id))

                        return (
                          <div
                            key={module.id}
                            className="relative overflow-visible z-50"
                            onMouseEnter={(e) => {
                              setHoveredModule(module)
                              // Check if popup would overflow to the right
                              const rect = e.currentTarget.getBoundingClientRect()
                              const viewportWidth = window.innerWidth
                              const popupWidth = 288 // w-72 = 18rem = 288px
                              const wouldOverflow = rect.right + popupWidth > viewportWidth - 20
                              setHoverPosition(wouldOverflow ? "left" : "right")
                            }}
                            onMouseLeave={() => setHoveredModule(null)}
                            onTouchStart={(e) => {
                              e.preventDefault()
                              setHoveredModule(module)
                              setHoverPosition("right")
                            }}
                            onTouchEnd={() => setHoveredModule(null)}
                            onFocus={() => setHoveredModule(module)}
                            onBlur={() => setHoveredModule(null)}
                            tabIndex={0}
                          >
                            <label
                              className="flex items-center gap-2 p-2 rounded-lg bg-black/60 hover:bg-black/80 border border-red-500/20 hover:border-red-500/40 transition-colors cursor-pointer group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isModuleSelected}
                                onChange={() => toggleModule(pkg.id, module.id)}
                                className="w-5 h-5 rounded border-red-500/50 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                                {module.name}
                              </span>
                              {(module.mediaUrl || module.description) && (
                                <Play className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                              )}
                            </label>

                            {hoveredModule?.id === module.id && (module.description || module.mediaUrl) && (
                              <>
                                {/* Mobile backdrop */}
                                <div className="max-md:fixed max-md:inset-0 max-md:bg-black/50 max-md:z-[9998] md:hidden" />
                                
                                <div
                                  className={`absolute w-72 bg-black/95 border border-red-500/40 rounded-xl p-4 shadow-2xl shadow-red-500/30 z-[9999] animate-fade-slide-in pointer-events-none
                                    ${
                                      hoverPosition === "right"
                                        ? "md:left-full md:top-0 md:ml-2"
                                        : "md:right-full md:top-0 md:mr-2"
                                    }
                                    max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[90vw] max-md:max-w-[400px] max-md:max-h-[80vh] max-md:overflow-y-auto`}
                                  style={{
                                    animation: "fadeSlideIn 0.3s ease-out forwards",
                                    maxWidth: "calc(100vw - 2rem)",
                                  }}
                                >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-white font-semibold flex-1">{module.name}</h4>
                                  {module.price && (
                                    <span className="text-red-500 font-bold text-lg ml-2">{module.price}</span>
                                  )}
                                </div>
                                {module.description && (
                                  <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                                )}
                                {module.mediaUrl && (
                                  <div className="aspect-video bg-black rounded-lg overflow-hidden pointer-events-auto">
                                    {getMediaType(module.mediaUrl) === "image" ? (
                                      <img
                                        src={module.mediaUrl || "/placeholder.svg"}
                                        alt={module.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : getMediaType(module.mediaUrl) === "video" ? (
                                      <video
                                        src={module.mediaUrl}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                      />
                                    ) : null}
                                  </div>
                                )}
                                {module.exampleJson && (
                                  <pre className="mt-3 text-xs text-gray-500 bg-black/50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                                    {module.exampleJson}
                                  </pre>
                                )}
                              </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowForm(true)
                      }}
                      className="w-full mt-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105"
                    >
                      TEKLİF AL
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-slide-in"
            style={{
              animation: "slideIn 0.7s ease-out forwards",
            }}
          >
            <div className="max-w-[500px] w-full bg-black/95 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6 shadow-2xl shadow-red-500/30 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">Teklif Formu</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-black/90 border border-red-500/30 hover:border-red-500/50 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Geri Dön</span>
                </button>
              </div>

              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="text-sm text-gray-300">
                  <strong className="text-white">Seçili Paket:</strong>{" "}
                  {packages.find((p) => p.id === selectedPackage)?.title}
                </div>
                {selectedModules[selectedPackage || ""]?.length > 0 && (
                  <div className="text-sm text-gray-300 mt-2">
                    <strong className="text-white">Seçili Modüller:</strong>{" "}
                    {selectedModules[selectedPackage || ""]
                      .map((modId) => {
                        const pkg = packages.find((p) => p.id === selectedPackage)
                        const mod = pkg?.modules.find((m) => m.id === modId)
                        return mod?.name
                      })
                      .join(", ")}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      İsim <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-2 bg-black/80 border border-red-500/30 rounded-lg text-white focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Soyisim <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2 bg-black/80 border border-red-500/30 rounded-lg text-white focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kurumsal Bilgi (İsteğe bağlı)</label>
                  <textarea
                    rows={3}
                    value={formData.companyInfo ?? ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyInfo: e.target.value }))}
                    placeholder="Şirket adı, sektör, proje detayları..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sosyal Medya Hesapları (İsteğe bağlı)
                  </label>
                  <div className="space-y-3">
                    {formData.socialMedia.map((social, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <span className="text-lg">{getPlatformIcon(social.platform)}</span>
                          <select
                            value={social.platform}
                            onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                            className="px-2 py-1 bg-black/80 border border-red-500/30 rounded text-white text-sm focus:outline-none focus:border-red-500"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">X (Twitter)</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          value={social.username}
                          onChange={(e) => updateSocialMedia(index, 'username', e.target.value)}
                          placeholder="@kullaniciadi"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-gray-500">
                      💡 Boş bırakabilirsiniz. Sadece dolu olan hesaplar gönderilecek.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 mt-4"
                >
                  Teklif Gönder
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
