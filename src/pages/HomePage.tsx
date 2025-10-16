import { Header } from "../components/Header"
import { ProcessSection } from "../components/ProcessSection"
import { AboutUs } from "../components/AboutUs"
import { Services } from "../components/Services"
import { processSteps } from "../data/packages"
import { setHomePageSEO } from "../lib/seo-utils"
import { Mail, Phone, MapPin } from "lucide-react"
import { Suspense, lazy } from "react"

// Lazy load heavy 3D gallery
const GalleryPage = lazy(() => import("../components/GalleryPage"))

export function HomePage() {
  // SEO ayarlarını güncelle
  setHomePageSEO()

  return (
    <>
      <Header />
      <div className="pt-24">
        <Suspense fallback={
          <div className="h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600">3D Galeri yükleniyor...</p>
            </div>
          </div>
        }>
          <GalleryPage />
        </Suspense>

        {/* About Us Section */}
        <AboutUs />

        {/* Services Section */}
        <Services />

        {/* Important Notes Section */}
        <section className="pt-8 pb-12" style={{ backgroundColor: "#D3DADD" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Önemli Noktalar</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  <strong>Revizyon Hakkı:</strong> Her içerik seti için 1 revizyon hakkı dahil
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  <strong>Telif Hakları:</strong> Üretilen içeriklerin kullanım hakları net olarak tanımlanır
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  <strong>SLA Garantisi:</strong> Paket türüne göre 24-48 saat destek süresi
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>
                  <strong>Ölçeklenebilirlik:</strong> İhtiyaçlarınıza göre paket genişletme imkanı
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Free Digital Analysis Section */}
        <section className="py-20" style={{ backgroundColor: "#D3DADD" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ücretsiz Dijital Analiz</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Online platformlardaki ayak izinizi değerlendirerek, markanızın dijital varlığını nasıl geliştireceğiniz
              konusunda size özel öneriler sunuyoruz.
            </p>

            <div className="max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ad - Soyad"
                      className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="E-posta"
                      className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Website"
                      className="w-full px-4 py-3 bg-black/80 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/90 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105"
                >
                  Rapor İste
                </button>
              </form>
            </div>
          </div>
        </section>

        <ProcessSection steps={processSteps} />

        {/* Contact Section */}
        <section id="contact" className="py-20" style={{ backgroundColor: "#D3DADD" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">İletişime Geçin</h2>
            <p className="text-xl text-gray-600 mb-12">
              Size en uygun paketi belirlemek ve teklif almak için bizimle iletişime geçin
            </p>

            <div className="grid sm:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
                <p className="text-gray-600">info@example.com</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
                <p className="text-gray-600">+90 XXX XXX XX XX</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Konum</h3>
                <p className="text-gray-600">İstanbul, Türkiye</p>
              </div>
            </div>

            <button
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold 
                             rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Teklif Talep Et
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8" style={{ backgroundColor: "#D3DADD" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600">© 2025 TEKNOLOJİ MENAJERİ. Tüm hakları saklıdır.</p>
            <p className="text-gray-500 text-sm mt-2">
              Fiyatlar örnek niteliğinde olup, proje kapsamına göre değişiklik gösterebilir.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
