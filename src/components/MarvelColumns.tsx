import { useState, useCallback } from "react"
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

  const handleColumnClick = useCallback((columnId: string) => {
    setExpandedColumn(prev => prev === columnId ? null : columnId)
  }, [])

  return (
    <div className="h-screen w-full overflow-hidden bg-black flex" style={{ marginTop: '0' }}>
      {columns.map((column) => {
        const isExpanded = expandedColumn === column.id
        const isOtherExpanded = expandedColumn !== null && !isExpanded

        return (
          <div
            key={column.id}
            className={`relative h-full transition-all duration-500 ease-out cursor-pointer overflow-hidden ${
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
                isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{ willChange: 'opacity' }}
            >
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[0.3em] text-white"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  textShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(59,130,246,0.3)",
                  letterSpacing: "0.15em",
                }}
              >
                {column.title}
              </h2>
            </div>

            {/* Expanded Content */}
            <div
              className={`absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 transition-all duration-500 ease-out ${
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="max-w-2xl space-y-4">
                <div className="space-y-2">
                  <h3 className="whitespace-nowrap text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-300 tracking-[0.08em] leading-tight text-balance">
                    {column.title}
                  </h3>
                  <p className="text-lg md:text-xl font-semibold text-blue-200 tracking-[0.16em]">{column.description}</p>
                </div>

                <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-xl text-pretty">
                  {column.content}
                </p>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-base px-5 md:px-6 py-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none" style={{ willChange: 'opacity' }}>
                <div className="bg-blue-600/20 backdrop-blur-sm border-2 border-blue-400 rounded-sm px-6 py-3">
                  <p className="text-white font-bold text-sm tracking-wider">GENİŞLETMEK İÇİN TIKLAYIN</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
