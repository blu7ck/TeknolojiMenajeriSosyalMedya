import { Header } from "../components/Header"
import { processSteps } from "../data/packages"
import { setHomePageSEO } from "../lib/seo-utils"
import { Suspense, lazy } from "react"
import { MarvelColumns } from "../components/MarvelColumns"

// Lazy load heavy components for better performance
const ProcessSection = lazy(() => import("../components/ProcessSection"))
const AboutUs = lazy(() => import("../components/AboutUs"))
const Services = lazy(() => import("../components/Services"))

export default function HomePage() {
  // SEO ayarlarını güncelle
  setHomePageSEO()

  return (
    <>
      <Header />
      <div className="pt-0 bg-[#050505] text-[#E5E7EB]">
        {/* Marvel Columns Section */}
        <MarvelColumns />

        {/* About Us Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div></div>}>
          <AboutUs />
        </Suspense>

        {/* Services Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div></div>}>
          <Services />
        </Suspense>

        {/* Important Notes Section */}
        <section className="py-12 border-t border-red-500/15 bg-[#0E0F0F]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-red-400">Önemli Noktalar</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[{
                title: "Revizyon Hakkı",
                body: "Her içerik seti için 1 revizyon hakkı dahil",
                icon: "1"
              }, {
                title: "Telif Hakları",
                body: "Kullanım hakları net olarak tanımlanır",
                icon: "©"
              }, {
                title: "SLA Garantisi",
                body: "24-48 saat destek süresi",
                icon: "24"
              }, {
                title: "Ölçeklenebilirlik",
                body: "Paket genişletme imkanı",
                icon: "↗"
              }].map((item) => (
                <div key={item.title} className="rounded-xl border border-red-500/30 bg-black/75 p-6 text-center shadow-lg shadow-red-900/15 transition-transform duration-200 hover:-translate-y-1">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/90 text-sm font-bold text-white">
                    {item.icon}
                  </div>
                  <h4 className="mb-2 text-sm font-semibold text-[#F3F4F6] uppercase tracking-[0.18em]">{item.title}</h4>
                  <p className="text-xs text-[#9CA3AF]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

         <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div></div>}>
           <ProcessSection steps={processSteps} />
         </Suspense>

        {/* Footer */}
        <footer className="py-12" style={{ backgroundColor: "#DBDBDB" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-800">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img 
                src="https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/logo.svg" 
                alt="Teknoloji Menajeri Logo" 
                className="h-32 w-auto"
                width="128"
                height="128"
                loading="lazy"
                onError={(e) => {
                  console.log('Logo yüklenemedi, PNG deneniyor...')
                  const img = e.currentTarget
                  img.src = 'https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/logo.png'
                  img.onerror = () => {
                    console.log('PNG logo da yüklenemedi, metin logo gösteriliyor...')
                    img.style.display = 'none'
                    const textLogo = document.createElement('div')
                    textLogo.className = 'text-2xl font-bold text-red-600'
                    textLogo.textContent = 'TEKNOLOJİ MENAJERİ'
                    if (img.parentNode) {
                      img.parentNode.appendChild(textLogo)
                    }
                  }
                }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              Fiyatlar örnek niteliğinde olup, proje kapsamına göre değişiklik gösterebilir.
            </p>
            <p className="mt-3 text-gray-700">
              © 2025{' '}
              <a 
                href="https://www.teknolojimenajeri.com.tr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-red-600 transition-colors hover:text-red-500"
              >
                TEKNOLOJİ MENAJERİ
              </a>
              . Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
