import React from 'react';
import { Package } from '../types';
import { CheckCircle } from 'lucide-react';

interface PackageSectionProps {
  packages: Package[];
  onPackageSelect: (packageType: 'individual' | 'influencer' | 'business') => void;
}

export const PackageSection: React.FC<PackageSectionProps> = ({ packages, onPackageSelect }) => {
  const getPackageType = (id: string): 'individual' | 'influencer' | 'business' => {
    switch (id) {
      case 'individual': return 'individual';
      case 'influencer': return 'influencer';
      case 'business': return 'business';
      default: return 'individual';
    }
  };

  return (
    <section id="packages" className="py-20" style={{ backgroundColor: '#D3DADD' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Paket Seçenekleri
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İhtiyaçlarınıza en uygun paketi seçin ve modüler yapı ile özelleştirin
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative hover:shadow-xl hover:border-gray-300 transition-all duration-300"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-blue-600 text-3xl font-bold">{pkg.pricing}</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Hedef Kitle:</h4>
                  <p className="text-gray-600 text-sm">{pkg.target}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Özellikler:</h4>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => onPackageSelect(getPackageType(pkg.id))}
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Kendi Paketini Oluştur
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
