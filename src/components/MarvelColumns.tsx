import { useState, useCallback, useEffect } from "react"
import { ChevronRight } from "lucide-react"

interface Column {
  id: string
  title: string
  image: string
  description: string
  content: string
}

const columns: Column[] = [
  {
    id: "social-media",
    title: "SOSYAL MEDYA",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Dijital Dünyada Güçlü Varlık",
    content: "Sosyal medya platformlarında markanızı güçlendirin. Instagram, TikTok, Facebook ve diğer platformlarda etkileyici içeriklerle hedef kitlenize ulaşın. Profesyonel fotoğraf ve video çekimleri ile markanızı öne çıkarın."
  },
  {
    id: "digital-strategy",
    title: "DİJİTAL STRATEJİ",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Akıllı Dijital Planlama",
    content: "Dijital dünyada başarılı olmak için doğru strateji şart. Hedef kitle analizi, rakip analizi ve içerik planlaması ile markanızı dijital dünyada güçlendirin. Veri odaklı kararlarla büyüyün."
  },
  {
    id: "content-creation",
    title: "İÇERİK ÜRETİMİ",
    image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Yaratıcı İçerikler",
    content: "Markanızın hikayesini anlatan etkileyici içerikler üretiyoruz. Fotoğraf, video, grafik tasarım ve yazılı içeriklerle hedef kitlenizi etkileyin. Her platform için özel olarak tasarlanmış içerikler."
  },
  {
    id: "team-collaboration",
    title: "ANALİZ & DANISMANLIK",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Anlık Danışmanlık ve Analiz",
    content: "Markanızın dijital dünyada nasıl gelişeceğini analiz ediyoruz. Hedef kitlenizi tanıyoruz, rakiplerinizi analiz ediyoruz ve markanızın dijital dünyada nasıl gelişeceğini belirliyoruz."
  },
  {
    id: "business-growth",
    title: "MARKA YÖNETİMİ",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Sürdürülebilir Büyüme",
    content: "İşinizi dijital dünyada büyütmek için doğru adımları atın. Müşteri kazanımı, marka bilinirliği ve satış artışı için kapsamlı dijital pazarlama stratejileri. Ölçülebilir sonuçlarla büyüyün."
  }
]

export function MarvelColumns() {
  const [expandedColumn, setExpandedColumn] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.innerWidth < 768
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setExpandedColumn(null)
    }
  }, [isMobile])

  const handleColumnClick = useCallback((columnId: string) => {
    setExpandedColumn(prev => prev === columnId ? null : columnId)
  }, [])

  if (isMobile) {
    return (
      <div className="w-full bg-black text-white" style={{ paddingTop: "112px" }}>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-10">
          {columns.map((column) => {
            const isExpanded = expandedColumn === column.id
            const contentId = `${column.id}-content`

            return (
              <div
                key={column.id}
                className="overflow-hidden rounded-2xl border border-red-500/30 bg-black/80 shadow-lg shadow-red-900/15 backdrop-blur"
              >
                <button
                  type="button"
                  onClick={() => handleColumnClick(column.id)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-red-500/5"
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                >
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-red-500/40">
                    <img
                      src={column.image}
                      alt={column.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-base font-semibold uppercase tracking-[0.18em] text-red-200">
                      {column.title}
                    </h3>
                    <p className="text-xs text-red-100/80">
                      {column.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 flex-shrink-0 transition-transform ${
                      isExpanded ? "rotate-90 text-red-300" : "text-red-200"
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div id={contentId} className="space-y-4 px-4 pb-5 text-sm text-white/90">
                    <p>{column.content}</p>
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-red-700"
                      onClick={() => {
                        window.location.href = `/more?section=${column.id}`
                      }}
                    >
                      Daha Fazla Bilgi
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black" style={{ marginTop: '0' }}>
      {columns.map((column) => {
        const isExpanded = expandedColumn === column.id
        const isOtherExpanded = expandedColumn !== null && !isExpanded

        return (
          <div
            key={column.id}
            className={`relative h-full cursor-pointer overflow-hidden transition-all duration-500 ease-out ${
              isExpanded ? "flex-[4]" : isOtherExpanded ? "flex-[0.5]" : "flex-1"
            }`}
            onClick={() => handleColumnClick(column.id)}
            style={{ willChange: 'flex' }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
              style={{
                backgroundImage: `url(${column.image})`,
                transform: isExpanded ? "scale(1.05)" : "scale(1)",
                willChange: 'transform'
              }}
            >
              {/* Dark Overlay */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ease-out ${
                  isExpanded ? "opacity-70" : "opacity-40"
                }`}
                style={{ willChange: 'opacity' }}
              />
            </div>

            {/* Vertical Title (Collapsed State) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out ${
                isExpanded ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{ willChange: 'opacity' }}
            >
              <h2
                className="text-3xl font-extrabold tracking-[0.3em] text-white md:text-4xl lg:text-5xl"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg) scale(0.6)",
                  textShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(59,130,246,0.3)",
                  letterSpacing: "0.15em",
                }}
              >
                {column.title}
              </h2>
            </div>

            {/* Expanded Content */}
            <div
              className={`absolute inset-0 flex flex-col justify-center px-8 transition-all duration-500 ease-out md:px-16 lg:px-24 ${
                isExpanded ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-8 opacity-0"
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="max-w-2xl space-y-4">
                <div className="space-y-2">
                  <h3 className="text-3xl font-extrabold tracking-[0.08em] text-blue-300 leading-tight text-balance md:text-4xl lg:text-5xl">
                    {column.title}
                  </h3>
                  <p className="text-lg font-semibold tracking-[0.16em] text-blue-200 md:text-xl">{column.description}</p>
                </div>

                <p className="max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                  {column.content}
                </p>

                <button
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl md:px-6 md:text-base"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = `/more?section=${column.id}`
                  }}
                >
                  DAHA FAZLA BİLGİ
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Hover Indicator (when collapsed) */}
            {!isExpanded && !isOtherExpanded && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out hover:opacity-100" style={{ willChange: 'opacity' }}>
                <div className="rounded-sm border-2 border-blue-400 bg-blue-600/20 px-6 py-3 backdrop-blur-sm">
                  <p className="text-sm font-bold tracking-wider text-white">GENİŞLETMEK İÇİN TIKLAYIN</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
