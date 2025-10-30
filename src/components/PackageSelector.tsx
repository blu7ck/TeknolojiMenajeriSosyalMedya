"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Check, X, Play, ArrowLeft } from "lucide-react"
import "./PackageSelector.css"
import QuoteButton from './QuoteButton'

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
  const [hoverPosition, setHoverPosition] = useState<"left" | "right">("right")
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.innerWidth < 768
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isMobile) {
      setHoveredModule(null)
    }
  }, [isMobile])

  const selectedPackageData = selectedPackage ? packages.find((pkg) => pkg.id === selectedPackage) || null : null
  const selectedModuleNames = selectedPackageData
    ? (selectedModules[selectedPackageData.id] || []).map((moduleId: string) => {
        const module = selectedPackageData.modules.find((mod) => mod.id === moduleId)
        return module?.name || moduleId
      })
    : []

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
                    <p className="mt-auto text-[11px] text-red-300/80 leading-relaxed">
                      Fiyatlar örnek niteliğinde olup, proje kapsamına göre değişiklik gösterebilir.
                    </p>
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
                            onMouseEnter={!isMobile ? (e) => {
                              setHoveredModule(module)
                              const rect = e.currentTarget.getBoundingClientRect()
                              const viewportWidth = window.innerWidth
                              const popupWidth = 288
                              const wouldOverflow = rect.right + popupWidth > viewportWidth - 20
                              setHoverPosition(wouldOverflow ? "left" : "right")
                            } : undefined}
                            onMouseLeave={!isMobile ? () => setHoveredModule(null) : undefined}
                            onTouchStart={undefined}
                            onTouchEnd={undefined}
                            onFocus={!isMobile ? () => setHoveredModule(module) : undefined}
                            onBlur={!isMobile ? () => setHoveredModule(null) : undefined}
                            tabIndex={isMobile ? -1 : 0}
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

                            {!isMobile && hoveredModule?.id === module.id && (module.description || module.mediaUrl) && (
                              <>
                                {/* Mobile backdrop */}
                                
                                <div
                                  className={`absolute w-72 bg-black/95 border border-red-500/40 rounded-xl p-4 shadow-2xl shadow-red-500/30 z-[9999] animate-fade-slide-in
                                    ${
                                      hoverPosition === "right"
                                        ? "md:left-full md:top-0 md:ml-2 md:pointer-events-none"
                                        : "md:right-full md:top-0 md:mr-2 md:pointer-events-none"
                                    }
                                    max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[90vw] max-md:max-w-[400px] max-md:max-h-[80vh] max-md:overflow-y-auto max-md:pointer-events-auto`}
                                  style={{
                                    animation: "fadeSlideIn 0.3s ease-out forwards",
                                    maxWidth: "calc(100vw - 2rem)",
                                  }}
                                >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-white font-semibold flex-1">{module.name}</h4>
                                  <div className="flex items-center gap-2">
                                    {module.price && (
                                      <span className="text-red-500 font-bold text-lg">{module.price}</span>
                                    )}
                                    {/* Mobile close button */}
                                    <button
                                      onClick={() => setHoveredModule(null)}
                                      className="md:hidden text-gray-400 hover:text-white text-xl font-bold"
                                    >
                                      ×
                                    </button>
                                  </div>
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
                    <p className="mt-4 text-xs text-gray-400">
                      Modül seçmekte kararsız kaldıysanız, daha fazla bilgi ve yönlendirme için TEKLİF AL butonuna tıklayabilirsiniz.
                    </p>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* TEKLİF AL Butonu - Kartların Altında */}
        <div className="mt-12 flex justify-center items-center">
          <div className="flex justify-center items-center">
            <QuoteButton 
              packageTitle={selectedPackageData?.title || 'Paket Seçimi Bekleniyor'}
              packagePrice={selectedPackageData?.pricing || ''}
              selectedModules={selectedModuleNames}
              disabled={!selectedPackageData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
