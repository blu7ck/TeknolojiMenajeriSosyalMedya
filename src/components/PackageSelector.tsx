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
        mediaUrl: "/test.mp4",
        exampleJson: 'Profesyonel Seviyede 12 Fotoğraf ve 2 Video | Sosyal Medya Eğitimi',
        price: "₺2,500",
      },
      {
        id: "kisiye-ozel-icerik",
        name: "Kişiye Özel İçerik Üretimi",
        description: "Görsel",
        mediaUrl: "/test2.mp4",
        exampleJson: '4 Adet Görsel',
        price: "₺800",
      },
      {
        id: "mini-video",
        name: "Mini Video (Reel)",
        description: "Anılarınızı canlandırabilir, hayallerinizi gerçekleştirebilirsiniz :)",
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
        exampleJson: '{"deliverables": "Aylık 2 Saat Danışmanlık Hizmeti + Profesyonel Seviyede 20 Fotoğraf + 4 Video + Anlık İletişim Hizmeti"}',
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
    socialMedia: [""],
  })
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('right')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPkg = packages.find((p) => p.id === selectedPackage)
    const modules = selectedModules[selectedPackage || ""] || []

    console.log("[v0] Form submitted:", {
      package: selectedPkg?.title,
      modules: modules,
      formData,
    })

    alert("Teklifiniz alındı! En kısa sürede size dönüş yapacağız.")
  }

  const addSocialMediaField = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, ""],
    }))
  }

  const updateSocialMedia = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) => (i === index ? value : (item ?? ""))),
    }))
  }

  const removeSocialMedia = (index: number) => {
    if (formData.socialMedia.length <= 1) return

    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }))
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
          <div className="flex flex-col md:flex-row gap-8 overflow-visible items-start" onClick={handleContainerClick}>
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
                    relative rounded-2xl p-6 cursor-pointer overflow-visible
                    transition-all duration-500 ease-out
                    flex flex-col
                    ${
                      isSelected
                        ? "bg-black/95 backdrop-blur-sm border-2 border-red-500 shadow-2xl shadow-red-500/40 md:flex-1 md:max-w-[500px]"
                        : "bg-black/80 border border-red-500/30 hover:border-red-500/60 hover:bg-black/90 md:w-72 md:flex-shrink-0 md:min-h-[240px]"
                    }
                    w-full
                  `}
                  style={{
                    transitionProperty: "all",
                    willChange: "transform, opacity, background-color, flex",
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="mb-4 min-h-0">
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{pkg.description}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{pkg.target}</p>
                  </div>

                  {isSelected && (
                    <div
                      className="space-y-2 animate-fade-in overflow-visible flex-1"
                      style={{
                        animation: "fadeSlideIn 0.5s ease-out forwards",
                      }}
                    >
                      <div className="text-sm font-semibold text-gray-300 mb-2">Modüller:</div>
                      {pkg.modules.map((module) => {
                        const isModuleSelected = Boolean(selectedModules[pkg.id]?.includes(module.id))

                        return (
                          <div
                            key={module.id}
                            className="relative overflow-visible"
                            onMouseEnter={(e) => {
                              setHoveredModule(module)
                              // Check if popup would overflow to the right
                              const rect = e.currentTarget.getBoundingClientRect()
                              const viewportWidth = window.innerWidth
                              const popupWidth = 288 // w-72 = 18rem = 288px
                              const wouldOverflow = rect.right + popupWidth > viewportWidth - 20
                              setHoverPosition(wouldOverflow ? 'left' : 'right')
                            }}
                            onMouseLeave={() => setHoveredModule(null)}
                            onFocus={() => setHoveredModule(module)}
                            onBlur={() => setHoveredModule(null)}
                            tabIndex={0}
                          >
                            <label
                              className="flex items-center gap-3 p-3 rounded-lg bg-black/60 hover:bg-black/80 border border-red-500/20 hover:border-red-500/40 transition-colors cursor-pointer group"
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
                              <div
                                className={`absolute w-72 bg-black/95 border border-red-500/40 rounded-xl p-4 shadow-2xl shadow-red-500/30 z-[100] animate-fade-slide-in pointer-events-none
                                  ${hoverPosition === 'right' 
                                    ? 'md:left-full md:top-0 md:ml-2' 
                                    : 'md:right-full md:top-0 md:mr-2'
                                  }
                                  max-md:left-0 max-md:top-full max-md:mt-2 max-md:ml-0`}
                                style={{
                                  animation: "fadeSlideIn 0.3s ease-out forwards",
                                  maxWidth: "calc(100vw - 2rem)",
                                }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-white font-semibold flex-1">{module.name}</h4>
                                  {module.price && (
                                    <span className="text-red-500 font-bold text-lg ml-2">
                                      {module.price}
                                    </span>
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
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowForm(true)
                      }}
                      className="w-full mt-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105"
                    >
                      TEKLİF AL
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {showForm && (
          <div
            className="absolute inset-0 animate-slide-in"
            style={{
              animation: "slideIn 0.7s ease-out forwards",
            }}
          >
             <div className="max-w-[500px] mx-auto bg-black/95 backdrop-blur-sm border border-red-500/40 rounded-2xl p-6 shadow-2xl shadow-red-500/30">
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
                  <div className="space-y-2">
                    {formData.socialMedia.map((social, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={social ?? ""}
                          onChange={(e) => updateSocialMedia(index, e.target.value)}
                          placeholder="@kullaniciadi veya platform/kullaniciadi"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                        {formData.socialMedia.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSocialMedia(index)}
                            className="px-3 py-2 bg-black/80 border border-red-500/30 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-black/90 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSocialMediaField}
                      className="text-sm text-red-500 hover:text-red-400 transition-colors"
                    >
                      + Hesap Ekle
                    </button>
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