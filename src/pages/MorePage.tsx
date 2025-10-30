import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const DESKTOP_NAV_HEIGHT = 96
const MOBILE_NAV_HEIGHT = 72

const sections = [
  {
    id: "social-media",
    title: "SOSYAL MEDYA",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Dijital Dünyada Güçlü Varlık",
    content: "Sosyal medya platformlarında markanızı güçlendirin. Instagram, TikTok, Facebook ve diğer platformlarda etkileyici içeriklerle hedef kitlenize ulaşın. Profesyonel fotoğraf ve video çekimleri ile markanızı öne çıkarın.",
    details: [
      "Instagram, TikTok, Facebook, LinkedIn ve diğer platformlarda profesyonel içerik üretimi",
      "Hedef kitle analizi ve platform stratejisi geliştirme",
      "Görsel ve video içerik tasarımı",
      "Sosyal medya hesap yönetimi ve etkileşim artırma",
      "Influencer işbirlikleri ve kampanya yönetimi",
      "Sosyal medya reklamları ve hedefleme stratejileri",
      "Performans analizi ve raporlama"
    ]
  },
  {
    id: "digital-strategy",
    title: "DİJİTAL STRATEJİ",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Akıllı Dijital Planlama",
    content: "Dijital dünyada başarılı olmak için doğru strateji şart. Hedef kitle analizi, rakip analizi ve içerik planlaması ile markanızı dijital dünyada güçlendirin. Veri odaklı kararlarla büyüyün.",
    details: [
      "Kapsamlı dijital pazarlama stratejisi geliştirme",
      "Hedef kitle araştırması ve persona oluşturma",
      "Rakip analizi ve pazar araştırması",
      "İçerik takvimi ve yayın stratejisi planlama",
      "Dijital kanal optimizasyonu",
      "KPI belirleme ve performans takibi",
      "ROI analizi ve strateji revizyonu"
    ]
  },
  {
    id: "content-creation",
    title: "İÇERİK ÜRETİMİ",
    image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Yaratıcı İçerikler",
    content: "Markanızın hikayesini anlatan etkileyici içerikler üretiyoruz. Fotoğraf, video, grafik tasarım ve yazılı içeriklerle hedef kitlenizi etkileyin. Her platform için özel olarak tasarlanmış içerikler.",
    details: [
      "Profesyonel fotoğraf ve video çekimi",
      "Grafik tasarım ve görsel içerik üretimi",
      "Yazılı içerik ve blog yazıları",
      "Sosyal medya post tasarımları",
      "Video düzenleme ve montaj",
      "Animasyon ve motion graphics",
      "Brand guideline uyumlu içerik üretimi"
    ]
  },
  {
    id: "team-collaboration",
    title: "ANALİZ & DANISMANLIK",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Anlık Danışmanlık ve Analiz",
    content: "Markanızın dijital dünyada nasıl gelişeceğini analiz ediyoruz. Hedef kitlenizi tanıyoruz, rakiplerinizi analiz ediyoruz ve markanızın dijital dünyada nasıl gelişeceğini belirliyoruz.",
    details: [
      "Dijital varlık analizi ve değerlendirme",
      "Hedef kitle davranış analizi",
      "Rakip analizi ve benchmarking",
      "Pazar fırsatları araştırması",
      "Dijital strateji danışmanlığı",
      "Performans optimizasyonu önerileri",
      "Sürekli izleme ve raporlama"
    ]
  },
  {
    id: "business-growth",
    title: "MARKA YÖNETİMİ",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=1",
    description: "Sürdürülebilir Büyüme",
    content: "İşinizi dijital dünyada büyütmek için doğru adımları atın. Müşteri kazanımı, marka bilinirliği ve satış artışı için kapsamlı dijital pazarlama stratejileri. Ölçülebilir sonuçlarla büyüyün.",
    details: [
      "Marka kimliği ve pozisyonlama stratejisi",
      "Müşteri kazanımı ve retention stratejileri",
      "Lead generation ve conversion optimizasyonu",
      "E-posta pazarlama kampanyaları",
      "SEO ve SEM stratejileri",
      "E-ticaret optimizasyonu",
      "Müşteri deneyimi (CX) iyileştirme"
    ]
  }
]

export default function MorePage() {
  const [searchParams] = useSearchParams()
  const [activeSection, setActiveSection] = useState(0)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.innerWidth >= 1024
  })
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const navHeight = isDesktop ? DESKTOP_NAV_HEIGHT : MOBILE_NAV_HEIGHT
  const navHeightPx = `${navHeight}px`
  const contentHeight = `calc(var(--app-vh, 1vh) * 100 - ${navHeight}px)`

  useEffect(() => {
    const updateViewportMetrics = () => {
      if (typeof window === 'undefined') return
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--app-vh', `${vh}px`)
      setIsDesktop(window.innerWidth >= 1024)
    }

    updateViewportMetrics()
    window.addEventListener('resize', updateViewportMetrics)

    return () => {
      window.removeEventListener('resize', updateViewportMetrics)
    }
  }, [])

  const scrollToSection = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    setActiveSection(index)

    const element = document.getElementById(`section-${index}`)
    const container = scrollContainerRef.current

    if (element && container) {
      const containerTop = container.getBoundingClientRect().top
      const elementTop = element.getBoundingClientRect().top
      const offset = elementTop - containerTop + container.scrollTop

      container.scrollTo({ top: offset, behavior })
      return
    }

    if (element) {
      element.scrollIntoView({ behavior, block: 'center' })
    }
  }, [])

  useEffect(() => {
    const sectionId = searchParams.get('section')
    if (sectionId) {
      const sectionIndex = sections.findIndex(section => section.id === sectionId)
      if (sectionIndex !== -1) {
        requestAnimationFrame(() => {
          scrollToSection(sectionIndex, 'auto')
        })
      }
    }
  }, [searchParams, scrollToSection])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const sectionElements = Array.from(container.querySelectorAll('section[data-index]'))
    if (!sectionElements.length) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            if (!Number.isNaN(index)) {
              setActiveSection(index)
            }
          }
        })
      },
      {
        root: container,
        threshold: 0.6
      }
    )

    sectionElements.forEach(section => observer.observe(section))

    return () => {
      sectionElements.forEach(section => observer.unobserve(section))
      observer.disconnect()
    }
  }, [])

  const handleDirectContact = () => {
    const to = 'gulsah@teknolojimenajeri.com.tr'
    const ccAddresses = ['furkan@fixurelabs.dev', 'mucahit@fixurelabs.dev']
    const cc = ccAddresses.map(address => encodeURIComponent(address)).join(',')

    window.open(`mailto:${to}?cc=${cc}`)
  }

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ paddingTop: navHeightPx }}
    >
      {/* Custom Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="flex w-full flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ minHeight: navHeightPx }}
          >
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              <button
                onClick={() => navigate('/')}
                className="w-full rounded-xl px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-300 transition-colors duration-200 hover:bg-gray-800/80 hover:text-white sm:w-auto sm:text-xs"
              >
                Anasayfa
              </button>
            </div>

            <div className="flex w-full items-center justify-start gap-2 overflow-x-auto pb-2 pl-2 pr-2 sm:flex-1 sm:flex-wrap sm:justify-center sm:pb-0">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 md:px-6 md:py-2 md:text-sm ${
                    activeSection === index
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <button
              onClick={handleDirectContact}
              className="w-full rounded-xl border border-red-500/70 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400 transition-colors duration-200 hover:bg-red-500 hover:text-white sm:w-auto sm:text-xs"
            >
              Doğrudan İletişim
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto md:snap-y md:snap-mandatory"
          style={{ height: contentHeight }}
        >
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={`section-${index}`}
              data-index={index}
              className="relative flex snap-start items-center justify-center px-4 py-12 sm:px-6 md:px-8 md:py-16"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.78)), url(${section.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: isDesktop ? 'fixed' : 'scroll',
                minHeight: contentHeight
              }}
            >
              <div className="mx-auto max-w-4xl px-2 text-center sm:px-4 md:px-8">
                <h1 className="mb-5 text-3xl font-extrabold uppercase tracking-[0.18em] text-red-400 sm:text-4xl md:mb-6 md:text-5xl">
                  {section.title}
                </h1>
                <p className="mb-5 text-base font-semibold text-red-200 md:mb-7 md:text-xl">
                  {section.description}
                </p>
                <p className="mx-auto mb-8 max-w-3xl text-sm text-gray-300 md:mb-10 md:text-base">
                  {section.content}
                </p>

                <div className="rounded-2xl border border-red-500/25 bg-black/60 p-6 backdrop-blur-sm md:p-9">
                  <h2 className="mb-5 text-lg font-semibold text-gray-100 md:mb-6 md:text-xl">Hizmet Detayları</h2>
                  <div className="grid gap-3 text-left md:grid-cols-2 md:gap-4">
                    {section.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></div>
                        <p className="text-xs text-gray-300 md:text-sm">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}



