import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#0B0C0D] text-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold uppercase tracking-[0.2em] text-red-400 sm:text-4xl">
            Biz Kimiz?
          </h2>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-[#AEB3C2]">
            Teknoloji Menajeri, alanında uzmanlaşmış, güçlü referans portföyü ve teknolojik uzmanlıkla donatılmış bir ekiptir. Dijital varlığınızı büyütmek için strateji, üretim ve yönetimi tek çatı altında topluyoruz.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[{
            key: 'T',
            title: 'Teknolojik Uzmanlık',
            body: 'En güncel araçlar ve veri odaklı yaklaşım ile ölçülebilir sonuçlar üretiriz.'
          }, {
            key: 'R',
            title: 'Referans Portföyü',
            body: 'Çeşitli sektörlerden markalara başarı hikâyeleri ekleyerek büyüyoruz.'
          }, {
            key: 'U',
            title: 'Uzmanlaşma',
            body: 'Disiplinler arası güçlü ekip yapımız ile uçtan uca çözümler sunarız.'
          }].map((item) => (
            <div key={item.title} className="rounded-xl border border-red-500/30 bg-black/70 p-8 text-center shadow-lg shadow-red-900/15 transition-transform duration-200 hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-2xl font-bold text-white">
                {item.key}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#F3F4F6]">{item.title}</h3>
              <p className="text-sm text-[#AEB3C2]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
