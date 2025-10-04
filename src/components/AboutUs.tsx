import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20" style={{ backgroundColor: '#D3DADD' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Biz Kimiz?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Teknoloji Menajeri, alanında uzmanlaşmış, güçlü referans portföyü ve teknolojik uzmanlıkla donatılmış bir şirkettir. Artık bu alanda da hizmet vermektir.
          </p>
        </div>
        
        {/* Additional content can be added here */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Teknolojik Uzmanlık</h3>
            <p className="text-gray-600">En güncel teknolojiler ve araçlarla donatılmış ekibimiz</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">R</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Referans Portföyü</h3>
            <p className="text-gray-600">Güçlü referanslar ve başarılı proje geçmişi</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">U</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Uzmanlaşma</h3>
            <p className="text-gray-600">Alanında uzmanlaşmış profesyonel hizmet anlayışı</p>
          </div>
        </div>
      </div>
    </section>
  );
};
