import { Package, Module, ProcessStep } from '../types';

export const individualModules: Module[] = [
  {
    name: 'Fenomen Paket',
    description: 'Mentorluk + İçerik Üretimi',
    deliverables: 'Profesyonel Seviyede 12 Fotoğraf + 2 Video | Sosyal Medya Eğitimi',
    price: '5000 TRY'
  },
  {
    name: 'Kişiye Özel İçerik Üretimi',
    description: 'Görsel',
    deliverables: '4 Adet Görsel',
    price: '800 TRY'
  },
  {
    name: 'Mini Video (Reel)',
    description: 'Anılarınızı canlandırabilir, hayallerinizi gerçekleştirebilirsiniz :)',
    deliverables: '1 Adet Video',
    price: '1000 TRY'
  },
  {
    name: 'Trend AI İçerikler',
    description: 'Sosyal Medya Viral İçerikleri',
    deliverables: 'Görsel | Video',
    price: '300 TRY | 650 TRY'
  }
];

export const influencerModules: Module[] = [
  {
    name: 'Infiluencer Başlangıç Paketi',
    description: 'Danışmanlık + Profil Yönetimi + İçerik Takvimi + İçerik Üretimi + Hedef Kitle Analizi',
    deliverables: 'Aylık 2 Saat Danışmanlık Hizmeti + Profesyonel Seviyede 20 Fotoğraf + 4 Video + Anlık İletişim Hizmeti',
    price: '20.000 TRY'
  },
  {
    name: 'Marka İşbirliği İçerik Üretimi',
    description: 'Görsel + Caption + Hashtag | Video + Caption + Hashtag',
    deliverables: 'Görsel | Video',
    price: '1500 TRY | 4000 TRY'
  },
  {
    name: 'Mini Video (Platform Uyumlu)',
    description: 'Kısa video',
    deliverables: '1 Adet Video',
    price: '1.000 TRY'
  },
  {
    name: 'UGC Seti',
    description: 'İstenilen Stilde',
    deliverables: '1 Adet UGC Video',
    price: '5000 TRY'
  },
];

export const businessModules: Module[] = [
  {
    name: 'Sosyal Medya Yönetimi',
    description: 'Hesapların tam kapsamlı yönetimi',
    deliverables: '1-3 platform yönetimi',
    price: '35.000 TRY/ay'
  },
  {
    name: 'Video İçerik Üretimi',
    description: 'Yapay Zeka destekli veya UE5 profesyonel video',
    deliverables: '1 Adet Video',
    price: '3000 TRY Başlangıç Fiyatı'
  },
  {
    name: 'Web Sitesi Tasarımı',
    description: 'Kurumsal veya e-ticaret site',
    deliverables: 'Website',
    price: '15.000 TRY Başlangıç Fiyatı'
  },
  {
    name: 'SEO',
    description: 'İçerik optimizasyonu',
    deliverables: 'Aylık rapor + İçerik planı',
    price: '15.000 TRY/ay'
  },
  {
    name: 'Kişisel Marka Danışmanlığı',
    description: '1 Saatlik Online Oturum',
    deliverables: 'Rapor',
    price: '10.000 TRY'
  },
];

export const packages: Package[] = [
    {
      id: 'individual',
      title: 'Bireysel Kullanıcı',
      description: 'Kişisel hesaplar için profesyonel görünüm',
      target: 'Sosyal medyayı daha düzenli, estetik ve profesyonel kullanmak isteyen bireyler, kişisel marka oluşturmak isteyenler, hobi içerik üreticileri',
      modules: individualModules,
      pricing: '300-5.000 TRY',
      features: [
        'Fenomen Paket',
        'Kişiye Özel İçerik Üretimi',
        'Mini Video',
        'Trend AI İçerikler',
      ]
    },
    {
      id: 'influencer',
      title: 'Influencer Paketi',
      description: 'İçerik üreticileri ve marka işbirlikleri için',
      target: 'Gelir elde eden veya gelir hedefleyen içerik üreticileri, markalarla işbirliği yapanlar veya işbirliği sürecine hazırlananlar',
      modules: influencerModules,
      pricing: '1.000-20.000 TRY',
      features: [
        'Infiluencer Başlangıç Paketi',
        'Marka işbirliği içerik üretimi',
        'Mini Video',
        'UGC içerik setleri'
      ]
    },
    {
      id: 'business',
      title: 'İşletme Paketi',
      description: 'KOBİ\'den kurumsala tam çözüm',
      target: 'KOBİ\'den kurumsala kadar işletmeler, marka yönetimi, satış odaklı sosyal medya, SEO ve dijital büyüme hedefleri',
      modules: businessModules,
      pricing: '3.000-35.000+ TRY',
      features: [
        'Sosyal Medya Yönetimi',
        'Video İçerik Üretimi',
        'Web Sitesi Tasarımı',
        'SEO ve İçerik optimizasyonu',
        'Kişisel Marka Danışmanlığı',
        'Detaylı raporlama'
      ]
    }
  ]
  
  
export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Satış & Teklif',
    description: 'Teklif gönderimi (paket + modüller) ve ihtiyaç analizi'
  },
  {
    step: 2,
    title: 'Sözleşme & Ödeme',
    description: 'Ön ödeme alımı ve sözleşme imzalama süreci'
  },
  {
    step: 3,
    title: 'Brief / Intake Form',
    description: 'Hedefler, tone-of-voice, görsel referans ve erişim bilgilerinin alınması'
  },
  {
    step: 4,
    title: 'Kickoff Toplantısı',
    description: '30-60 dakikalık başlangıç toplantısı ve detay belirleme'
  },
  {
    step: 5,
    title: 'İçerik Takvimi Hazırlık',
    description: 'İlk taslak içerik planının oluşturulması'
  },
  {
    step: 6,
    title: 'Üretim',
    description: 'Görsel/video üretimi ve içerik hazırlama süreci'
  },
  {
    step: 7,
    title: 'Onay & Yayın',
    description: 'İçeriklerin onaylanması ve planlanan zamanda yayına alınması'
  },
  {
    step: 8,
    title: 'Raporlama',
    description: 'Aylık performans raporu ve aksiyon maddelerinin sunumu'
  }
];