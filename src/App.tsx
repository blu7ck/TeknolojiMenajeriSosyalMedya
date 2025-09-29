import React from 'react';
import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PackageSection } from './components/PackageSection';
import { ModuleMenu } from './components/ModuleMenu';
import { ProcessSection } from './components/ProcessSection';
import { PackageBuilder } from './components/PackageBuilder';
import { packages, individualModules, influencerModules, businessModules, processSteps } from './data/packages';
import { Mail, Phone, MapPin } from 'lucide-react';

function App() {
  const [isPackageBuilderOpen, setIsPackageBuilderOpen] = useState(false);
  const [selectedPackageType, setSelectedPackageType] = useState<'individual' | 'influencer' | 'business'>('individual');

  const handlePackageSelect = (packageType: 'individual' | 'influencer' | 'business') => {
    setSelectedPackageType(packageType);
    setIsPackageBuilderOpen(true);
  };

  const handlePackageBuilderOpen = () => {
    setIsPackageBuilderOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <PackageSection packages={packages} onPackageSelect={handlePackageSelect} />
      
      {/* Module Menu Section */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Modül Menüsü
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İhtiyaçlarınıza göre seçebileceğiniz tüm modüller ve fiyatlandırmaları
            </p>
          </div>

          <ModuleMenu 
            modules={individualModules} 
            categoryTitle="Bireysel Kullanıcı Modülleri" 
            onPackageBuilderOpen={handlePackageBuilderOpen}
          />
          <ModuleMenu modules={influencerModules} categoryTitle="Influencer Modülleri" />
          <ModuleMenu modules={businessModules} categoryTitle="İşletme Modülleri" />
        </div>
      </section>

      <ProcessSection steps={processSteps} />

      {/* Additional Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Key Points */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Önemli Noktalar</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Revizyon Hakkı:</strong> Her içerik seti için 1 revizyon hakkı dahil</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Telif Hakları:</strong> Üretilen içeriklerin kullanım hakları net olarak tanımlanır</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>SLA Garantisi:</strong> Paket türüne göre 24-48 saat destek süresi</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Ölçeklenebilirlik:</strong> İhtiyaçlarınıza göre paket genişletme imkanı</span>
                </li>
              </ul>
            </div>

            {/* Reporting */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Raporlama & KPI</h3>
              <p className="text-gray-700 mb-4">Aylık raporlarda yer alacak metrikler:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Erişim (reach) ve gösterimler (impressions)</li>
                <li>• Etkileşim sayısı ve oranları</li>
                <li>• Takipçi değişimi analizi</li>
                <li>• Link tıklamaları ve web trafiği</li>
                <li>• Dönüşümler ve satın alma metrikleri</li>
                <li>• Öne çıkan içerikler ve öğrenimler</li>
                <li>• Önerilen aksiyonlar ve gelecek planları</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            İletişime Geçin
          </h2>
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
          
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold 
                           rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Teklif Talep Et
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Sosyal Medya Paketleri. Tüm hakları saklıdır.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Fiyatlar örnek niteliğinde olup, proje kapsamına göre değişiklik gösterebilir.
          </p>
        </div>
      </footer>

      <PackageBuilder
        isOpen={isPackageBuilderOpen}
        onClose={() => setIsPackageBuilderOpen(false)}
        initialPackageType={selectedPackageType}
      />
    </div>
  );
}

export default App;