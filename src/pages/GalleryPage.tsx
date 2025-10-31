import { useEffect } from "react"
import { Link } from "react-router-dom"
import { setGalleryPageSEO } from "../lib/seo-utils"

type GalleryItem = {
  id: string
  gridClass: string
  badge: string
  title: string
  description: string
  image: string
  alt: string
  highlights: string[]
  stats?: Array<{
    value: string
    label: string
  }>
  tags?: string[]
}

const galleryItems: GalleryItem[] = [
  {
    id: "lumira",
    gridClass: "md:col-span-7 lg:col-span-8",
    badge: "Spatial Experience",
    title: "Lumira Spatial Eğitim Serisi",
    description: "Hatay Valiliği izinli #YüreğimizdekiIşık projesi kapsamında çocuklara ulaştırılan VR destekli etkileşimli öğrenme modülleri.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    alt: "VR gözlüğü kullanan öğrenci",
    highlights: [
      "360° VR sınıf senaryoları ve deneyim tasarımı",
      "Oyunlaştırılmış görev akışları ile etkileşimli içerik",
      "Offline-first mimari sayesinde düşük bağlantıda bile erişim"
    ],
    stats: [
      { value: "18", label: "Modül" },
      { value: "120+", label: "Öğrenci" },
      { value: "6", label: "Şehir" }
    ],
    tags: ["VR", "Spatial Computing", "Eğitim Teknolojileri"]
  },
  {
    id: "social",
    gridClass: "md:col-span-5 lg:col-span-4",
    badge: "Social Impact",
    title: "Marka Sosyal Medya Kampanyaları",
    description: "Dijital toplulukları harekete geçiren hikâye tabanlı içerik kümeleri ve kampanya landing tasarımları.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
    alt: "Sosyal medya kampanya ekranları",
    highlights: [
      "360° kampanya stratejisi & kreatif içerik planı",
      "Gerçek zamanlı KPI takibi ve optimizasyon",
      "Çok dilli içerik ve lokalizasyon yetkinliği"
    ],
    stats: [
      { value: "4.2M", label: "Erişim" },
      { value: "3.8x", label: "Etkileşim" }
    ],
    tags: ["Sosyal Medya", "İçerik Stüdyosu", "Topluluk"]
  },
  {
    id: "photography",
    gridClass: "md:col-span-6 lg:col-span-5",
    badge: "Brand Narrative",
    title: "Prodüksiyon & Fotoğrafçılık",
    description: "Markaların ürün hikâyelerini farklı dokularda anlatan stüdyo çekimleri, renk bilimini önceleyen kompozisyonlar.",
    image: "https://images.unsplash.com/photo-1529429617124-aee111bd6f13?auto=format&fit=crop&w=1200&q=80",
    alt: "Stüdyo fotoğraf çekimi",
    highlights: [
      "Fotorealistik render & gerçek çekim kombinasyonu",
      "Set yönetimi ve ışık mühendisliği",
      "Marka renk kimliğine sadık post-prodüksiyon"
    ],
    stats: [
      { value: "32", label: "Çekim Günü" },
      { value: "14", label: "Kampanya" }
    ],
    tags: ["Prodüksiyon", "Fotoğraf", "Renk Bilimi"]
  },
  {
    id: "event",
    gridClass: "md:col-span-6 lg:col-span-7",
    badge: "Live Activation",
    title: "Fiziksel Etkinlik Deneyimleri",
    description: "Startuplar ve yazılım ekipleri için interaktif demo alanları, mekâna özel dijital sanat kurulumları.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
    alt: "Dijital sanat kullanılan bir etkinlik",
    highlights: [
      "Gerçek zamanlı veri görselleştirme panelleri",
      "Temassız etkileşimli kiosk tasarımları",
      "Katılımcı yolculuğuna göre kişiselleştirilmiş deneyim"
    ],
    stats: [
      { value: "7", label: "Şehir" },
      { value: "25K", label: "Ziyaretçi" }
    ],
    tags: ["Etkinlik", "Dijital Sanat", "Deneyim Tasarımı"]
  }
]

export default function GalleryPage() {
  useEffect(() => {
    setGalleryPageSEO()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E7EB]">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-[-18rem] h-[32rem] w-[32rem] rounded-full bg-red-500/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-purple-500/20 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:pb-32 sm:pt-32">
          <header className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.48em] text-red-300">Vitrin</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Teknoloji Menajeri Galerisi
              </h1>
              <p className="mt-5 max-w-2xl text-base text-[#E5E7EB]/70">
                Sosyal medya kampanyalarından VR destekli eğitimlere kadar uzanan seçili projelerimizden anlık görüntüler. Her parça; strateji, kreatif üretim ve teknoloji mimarisinin birleştiği özgün bir deneyimi yansıtıyor.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M15 18 9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ana sayfa
            </Link>
          </header>

          <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
            {galleryItems.map((item) => (
              <article
                key={item.id}
                className={`${item.gridClass} relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:border-red-400/30`}
              >
                <div className="relative h-52 overflow-hidden rounded-t-3xl">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                  <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-5 px-6 pb-8 pt-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#E5E7EB]/75">{item.description}</p>
                  </div>

                  <ul className="space-y-2 text-sm text-[#E5E7EB]/80">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2">
                        <span aria-hidden className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-red-400" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {(item.stats?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {item.stats!.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                          <p className="text-lg font-semibold text-white">{stat.value}</p>
                          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {(item.tags?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags!.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>

          <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-red-600/40 via-rose-500/30 to-orange-400/30 p-[1px]">
            <div className="rounded-3xl bg-[#050505]/95 px-8 py-10 text-center sm:text-left sm:px-12 sm:py-14">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">Bir Sonraki Vitrin</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">Yeni projenizi teknoloji vitrinine taşıyalım</h2>
                  <p className="mt-4 max-w-xl text-sm text-[#E5E7EB]/75">
                    Deneyim tasarımı, içerik prodüksiyonu ve dijital strateji ekiplerimizle markanıza özel galeri oluşturmak için bizimle iletişime geçin.
                  </p>
                </div>
                <a
                  href="https://www.linkedin.com/company/teknoloji-menajeri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:border-white/30 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                >
                  Bizimle Bağlan
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 17 17 7m0 0H7m10 0v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

