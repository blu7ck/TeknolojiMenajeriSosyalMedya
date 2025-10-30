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
      <div className="pt-0">
        {/* Marvel Columns Section */}
        <MarvelColumns />

        {/* About Us Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div></div>}>
          <AboutUs />
        </Suspense>

        {/* Services Section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div></div>}>
          <Services />
        </Suspense>

        {/* Important Notes Section */}
        <section className="py-8" style={{ backgroundColor: "#D3DADD" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Önemli Noktalar</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-red-500/20">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Revizyon Hakkı</h4>
                <p className="text-xs text-gray-600">Her içerik seti için 1 revizyon hakkı dahil</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-red-500/20">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">©</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Telif Hakları</h4>
                <p className="text-xs text-gray-600">Kullanım hakları net olarak tanımlanır</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-red-500/20">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">24</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">SLA Garantisi</h4>
                <p className="text-xs text-gray-600">24-48 saat destek süresi</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-red-500/20">
                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">↗</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Ölçeklenebilirlik</h4>
                <p className="text-xs text-gray-600">Paket genişletme imkanı</p>
              </div>
            </div>
          </div>
        </section>

         <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div></div>}>
           <ProcessSection steps={processSteps} />
         </Suspense>

        {/* Footer */}
        <footer className="py-8" style={{ backgroundColor: "#D3DADD" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            
            <p className="text-gray-500 text-sm">
              Fiyatlar örnek niteliğinde olup, proje kapsamına göre değişiklik gösterebilir.
            </p>
            <p className="text-gray-600 mt-2">
              © 2025{' '}
              <a 
                href="https://www.teknolojimenajeri.com.tr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 font-semibold transition-colors"
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
