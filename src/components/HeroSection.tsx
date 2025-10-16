import React from 'react';
import { ArrowRight, Users, Zap, Target } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToPackages = () => {
    const element = document.getElementById('packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Modüler Sosyal Medya
            <span className="text-blue-600 block">Paketleri</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            İhtiyaçlarınıza özel modüler yapı ile bireysel kullanıcılardan büyük işletmelere 
            kadar her ölçekte profesyonel sosyal medya çözümleri sunuyoruz.
          </p>
          
          <button
            onClick={scrollToPackages}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200 group"
          >
            Paketleri İncele
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3 Ana Paket Türü</h3>
            <p className="text-gray-600">Bireysel, Influencer ve İşletme paketleri ile her ihtiyaca uygun çözüm</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Modüler Yapı</h3>
            <p className="text-gray-600">İstediğiniz modülleri seçin, ihtiyacınıza göre paketinizi oluşturun</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Şeffaf Fiyatlandırma</h3>
            <p className="text-gray-600">Her modül için net teslimat ve fiyat bilgisi ile güvenli planlama</p>
          </div>
        </div>
      </div>
    </section>
  );
};
