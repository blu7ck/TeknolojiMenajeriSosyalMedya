import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Calculator } from 'lucide-react';
import { Module, SelectedModule, ContactForm } from '../types';
import { individualModules, influencerModules, businessModules } from '../data/packages';
import AnimatedQuoteButton from './AnimatedQuoteButton';

interface PackageBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageType?: 'individual' | 'influencer' | 'business';
}

export const PackageBuilder: React.FC<PackageBuilderProps> = ({ 
  isOpen, 
  onClose, 
  initialPackageType = 'individual' 
}) => {
  const [selectedPackageType, setSelectedPackageType] = useState<'individual' | 'influencer' | 'business'>(initialPackageType);
  const [selectedModules, setSelectedModules] = useState<SelectedModule[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    packageType: initialPackageType,
    selectedModules: [],
    totalPrice: 0,
    message: ''
  });

  useEffect(() => {
    setSelectedPackageType(initialPackageType);
    setContactForm(prev => ({ ...prev, packageType: initialPackageType }));
  }, [initialPackageType]);

  const getModulesForPackage = (packageType: 'individual' | 'influencer' | 'business'): Module[] => {
    switch (packageType) {
      case 'individual': return individualModules;
      case 'influencer': return influencerModules;
      case 'business': return businessModules;
      default: return individualModules;
    }
  };

  const parsePrice = (priceString: string): number => {
    const match = priceString.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const calculateTotal = (): number => {
    return selectedModules.reduce((total, module) => {
      return total + parsePrice(module.price);
    }, 0);
  };

  const toggleModule = (module: Module) => {
    const moduleExists = selectedModules.find(m => m.name === module.name);
    
    if (moduleExists) {
      setSelectedModules(selectedModules.filter(m => m.name !== module.name));
    } else {
      setSelectedModules([...selectedModules, {
        name: module.name,
        price: module.price,
        category: selectedPackageType
      }]);
    }
  };

  const handlePackageTypeChange = (packageType: 'individual' | 'influencer' | 'business') => {
    setSelectedPackageType(packageType);
    setSelectedModules([]);
    setContactForm(prev => ({ ...prev, packageType }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...contactForm,
      selectedModules,
      totalPrice: calculateTotal()
    };
    
    console.log('Form submitted:', formData);
    alert('Talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.');
    onClose();
  };

  const getPackageTitle = (type: 'individual' | 'influencer' | 'business'): string => {
    switch (type) {
      case 'individual': return 'Bireysel Kullanıcı';
      case 'influencer': return 'Influencer';
      case 'business': return 'İşletme';
      default: return 'Bireysel Kullanıcı';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100">
              {showContactForm ? 'İletişim Formu' : 'Kendi Paketini Oluştur'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!showContactForm ? (
            <>
              {/* Package Type Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Paket Türü Seçin</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['individual', 'influencer', 'business'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePackageTypeChange(type)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedPackageType === type
                          ? 'border-blue-400 bg-blue-900 text-blue-200'
                          : 'border-slate-600 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold">{getPackageTitle(type)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  {getPackageTitle(selectedPackageType)} Modülleri
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {getModulesForPackage(selectedPackageType).map((module, index) => {
                    const isSelected = selectedModules.find(m => m.name === module.name);
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-blue-400 bg-blue-900'
                            : 'border-slate-600 hover:border-slate-600'
                        }`}
                        onClick={() => toggleModule(module)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                                isSelected ? 'border-blue-400 bg-blue-9000' : 'border-slate-600'
                              }`}>
                                {isSelected && <Plus size={16} className="text-white" />}
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-100">{module.name}</h4>
                                <p className="text-sm text-slate-300">{module.description}</p>
                                <p className="text-xs text-slate-400 mt-1">{module.deliverables}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-400">{module.price}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Modules Summary */}
              {selectedModules.length > 0 && (
                <div className="mb-8 p-4 bg-slate-800 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-3 flex items-center">
                    <Calculator size={20} className="mr-2" />
                    Seçilen Modüller ({selectedModules.length})
                  </h4>
                  <div className="space-y-2 mb-4">
                    {selectedModules.map((module, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">{module.name}</span>
                        <div className="flex items-center">
                          <span className="text-green-400 font-medium mr-2">{module.price}</span>
                          <button
                            onClick={() => setSelectedModules(selectedModules.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-100">Toplam Fiyat:</span>
                      <span className="text-xl font-bold text-blue-400">
                        {calculateTotal().toLocaleString('tr-TR')} TRY'den başlayan fiyatlarla
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  İptal
                </button>
                <AnimatedQuoteButton 
                  packageTitle={selectedPackageType === 'individual' ? 'Bireysel Paket' : selectedPackageType === 'influencer' ? 'İnfluencer Paket' : 'Kurumsal Paket'}
                  packagePrice={`${calculateTotal().toFixed(2)} TL`}
                  selectedModules={selectedModules.map(m => m.name)}
                />
              </div>
            </>
          ) : (
            /* Contact Form */
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Şirket/Kurum
                  </label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ek Mesaj
                </label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Projeniz hakkında detaylar, özel istekler..."
                />
              </div>

              {/* Selected Package Summary */}
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-2">Seçilen Paket Özeti</h4>
                <p className="text-sm text-slate-300 mb-2">
                  Paket Türü: <span className="font-medium">{getPackageTitle(selectedPackageType)}</span>
                </p>
                <p className="text-sm text-slate-300 mb-2">
                  Seçilen Modül Sayısı: <span className="font-medium">{selectedModules.length}</span>
                </p>
                <p className="text-sm text-slate-300">
                  Tahmini Fiyat: <span className="font-medium text-blue-400">
                    {calculateTotal().toLocaleString('tr-TR')} TRY'den başlayan fiyatlarla
                  </span>
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-6 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Geri Dön
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-400 transition-colors"
                >
                  Teklif Talep Et
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
