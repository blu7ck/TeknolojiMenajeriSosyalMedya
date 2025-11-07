"use client"

import type React from "react"
import type { CSSProperties } from "react"

import { useEffect, useState } from "react"
import { Check, X, Play } from "lucide-react"
import "./PackageSelector.css"
import QuoteButton from "./QuoteButton"
import { useTranslation } from "react-i18next"

interface Module {
  id: string
  name: string
  description?: string
  mediaUrl?: string
  example?: string
  price?: string
}

interface Package {
  id: string
  title: string
  description: string
  target: string
  modules: Module[]
}

interface SectionCopy {
  title: string
  subtitle: string
  disclaimer: string
  modulesLabel: string
  moduleHelp: string
  ctaLabel: string
  fallbackTitle: string
  fallbackPrice: string
}

export function PackageSelector() {
  const { t } = useTranslation()
  const sectionCopy = t("packages.section", { returnObjects: true }) as SectionCopy
  const packages = t("packages.list", { returnObjects: true }) as Package[]
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
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)

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

  const cardBaseStyle: CSSProperties = {
    transformStyle: "preserve-3d",
    WebkitTransformStyle: "preserve-3d"
  }

  const faceBaseStyle: CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden"
  }

  return (
    <div className="relative py-12 px-4">
      <div className={`relative mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-rose-100/70 bg-white/80 px-6 py-12 shadow-[0_45px_140px_-60px_rgba(244,114,182,0.55)] backdrop-blur transition-all duration-300 ${isQuoteOpen ? "ring-4 ring-rose-100/60" : ""}`}>
        <div className="pointer-events-none absolute -left-36 top-10 h-56 w-56 rounded-full bg-rose-200/40 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 bottom-12 h-64 w-64 rounded-full bg-sky-200/35 blur-[140px]" aria-hidden="true" />
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">{sectionCopy.title}</h2>
            <p className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400">
              {sectionCopy.subtitle}
            </p>
          </div>

          {!isQuoteOpen ? (
            <>
              <div className="relative transition-all duration-500 ease-in-out">
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-start perspective-1000"
                  onClick={handleContainerClick}
                >
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id

                    return (
                      <div
                        key={pkg.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPackage(isSelected ? null : pkg.id)
                        }}
                        className="relative w-full h-[280px] md:h-[320px] cursor-pointer transition-transform duration-700"
                        style={{
                          ...cardBaseStyle,
                          zIndex: isSelected ? 20 : 1
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-3xl p-6 flex flex-col border border-rose-200/60 bg-white/80 backdrop-blur transition-all duration-300 shadow-[0_25px_80px_-45px_rgba(244,114,182,0.65)] hover:border-rose-300 hover:bg-white/95"
                          style={{
                            ...faceBaseStyle,
                            transform: isSelected ? "rotateY(180deg)" : "rotateY(0deg)",
                            opacity: isSelected ? 0 : 1,
                            pointerEvents: isSelected ? "none" : "auto",
                            transition: "transform 0.7s ease, opacity 0.3s ease"
                          }}
                        >
                          <div className="mb-4 min-h-0">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.title}</h3>
                            <p className="text-sm text-slate-600 mb-2">{pkg.description}</p>
                            <p className="text-xs leading-relaxed text-slate-500">{pkg.target}</p>
                          </div>
                          <p className="mt-auto text-[11px] leading-relaxed text-rose-400">
                            {sectionCopy.disclaimer}
                          </p>
                        </div>

                        <div
                          className="absolute inset-0 rounded-3xl p-6 flex flex-col bg-white/98 backdrop-blur-sm border-2 border-rose-300 shadow-[0_35px_100px_-55px_rgba(244,114,182,0.7)]"
                          style={{
                            ...faceBaseStyle,
                            transform: isSelected ? "rotateY(0deg)" : "rotateY(-180deg)",
                            opacity: isSelected ? 1 : 0,
                            pointerEvents: isSelected ? "auto" : "none",
                            transition: "transform 0.7s ease, opacity 0.3s ease"
                          }}
                        >
                          <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/40 animate-pulse">
                            <Check className="w-5 h-5 text-white" />
                          </div>

                          <div className="space-y-1 animate-fade-in">
                            <div className="mb-1 text-sm font-semibold text-rose-500">
                              {sectionCopy.modulesLabel}
                            </div>
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
                                    className="group flex cursor-pointer items-center gap-2 rounded-xl border border-rose-100/60 bg-white/85 p-2 transition-colors hover:border-rose-300 hover:bg-white"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isModuleSelected}
                                      onChange={() => toggleModule(pkg.id, module.id)}
                                      className="h-5 w-5 cursor-pointer rounded border-rose-400 text-rose-500 focus:ring-rose-400 focus:ring-offset-0"
                                    />
                                    <span className="flex-1 text-sm text-slate-700 transition-colors group-hover:text-rose-600">
                                      {module.name}
                                    </span>
                                    {(module.mediaUrl || module.description) && (
                                      <Play className="w-4 h-4 text-rose-300 transition-colors group-hover:text-rose-500" />
                                    )}
                                  </label>

                                  {!isMobile && hoveredModule?.id === module.id && (module.description || module.mediaUrl || module.example) && (
                                    <div
                                      className={`absolute w-72 rounded-2xl border border-rose-200/70 bg-white/95 p-4 shadow-[0_25px_80px_-30px_rgba(244,114,182,0.45)] backdrop-blur-sm z-[9999] animate-fade-slide-in
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
                                      <div className="mb-2 flex items-start justify-between">
                                        <h4 className="flex-1 font-semibold text-slate-900">{module.name}</h4>
                                        <div className="flex items-center gap-2">
                                          {module.price && (
                                            <span className="text-lg font-bold text-rose-500">{module.price}</span>
                                          )}
                                          <button
                                            onClick={() => setHoveredModule(null)}
                                            className="text-xl font-bold text-rose-300 hover:text-rose-500 md:hidden"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      </div>
                                      {module.description && (
                                        <p className="mb-3 text-sm text-slate-600">{module.description}</p>
                                      )}
                                      {module.mediaUrl && (
                                        <div className="pointer-events-auto aspect-video overflow-hidden rounded-xl bg-slate-900/10">
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
                                      {module.example && (
                                        <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-rose-50 p-3 text-xs text-slate-600">
                                          {module.example}
                                        </pre>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            <p className="mt-4 text-xs text-slate-500">
                              {sectionCopy.moduleHelp}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-12">
                <QuoteButton
                  packageTitle={selectedPackageData?.title || sectionCopy.fallbackTitle}
                  packagePrice={selectedPackageData?.description || sectionCopy.fallbackPrice}
                  selectedModules={selectedModuleNames}
                  disabled={!selectedPackageData}
                  expanded={false}
                  onExpandChange={setIsQuoteOpen}
                />
              </div>
            </>
          ) : (
            <div className="mt-12">
              <QuoteButton
                packageTitle={selectedPackageData?.title || sectionCopy.fallbackTitle}
                packagePrice={selectedPackageData?.description || sectionCopy.fallbackPrice}
                selectedModules={selectedModuleNames}
                disabled={!selectedPackageData}
                expanded
                onExpandChange={setIsQuoteOpen}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
