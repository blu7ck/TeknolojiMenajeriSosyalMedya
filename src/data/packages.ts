import { Package, Module, ProcessStep } from '../types';

export const individualModules: Module[] = [
  {
    name: 'Statik İçerik Üretimi',
    description: 'Görsel + caption + hashtag',
    deliverables: '1 post',
    price: '200-600 TRY'
  },
  {
    name: 'Story Şablonu',
    description: 'Basit kişisel temalı görseller',
    deliverables: '3-5 story',
    price: '300-800 TRY'
  },
  {
    name: 'Mini Video (Reel/TikTok)',
    description: '15-30 sn video',
    deliverables: '1 video',
    price: '800-2.500 TRY'
  },
  {
    name: 'Profil Düzenleme',
    description: 'Bio + profil fotoğrafı önerisi + highlight',
    deliverables: '1 set',
    price: '500-1.200 TRY'
  },
  {
    name: 'AI İçerik Önerileri',
    description: '10 hazır içerik fikri',
    deliverables: 'PDF/Notion dosyası',
    price: '500-1.500 TRY'
  },
  {
    name: 'Kişisel Marka Danışmanlığı',
    description: '1 saatlik online oturum',
    deliverables: 'Not + öneri raporu',
    price: '1.000-3.000 TRY'
  }
];

export const influencerModules: Module[] = [
  {
    name: 'Statik İçerik Üretimi',
    description: 'Görsel + caption + hashtag',
    deliverables: '1 post',
    price: '200-800 TRY'
  },
  {
    name: 'Reel/TikTok',
    description: 'Trend uyumlu kısa video',
    deliverables: '1 video',
    price: '1.000-4.000 TRY'
  },
  {
    name: 'Story Paketi',
    description: 'Marka/ürün entegrasyonlu şablon',
    deliverables: '5 story',
    price: '500-1.500 TRY'
  },
  {
    name: 'Medya Kiti',
    description: 'PDF dosya (istatistik + portföy)',
    deliverables: '1 dosya',
    price: '1.000-3.500 TRY'
  },
  {
    name: 'UGC Seti',
    description: 'Doğal içerik (marka için kullanılabilir)',
    deliverables: '5 içerik',
    price: '3.000-10.000 TRY'
  },
  {
    name: 'Performans Raporu',
    description: 'Aylık erişim & etkileşim analizi',
    deliverables: '1 rapor',
    price: '2.000-5.000 TRY'
  }
];

export const businessModules: Module[] = [
  {
    name: 'Sosyal Medya Yönetimi',
    description: 'Hesapların tam kapsamlı yönetimi',
    deliverables: '1-3 platform yönetimi',
    price: '8.000-25.000 TRY/ay'
  },
  {
    name: 'Video İçerik Üretimi',
    description: '15-60 sn profesyonel video',
    deliverables: '1 video (çekim + montaj)',
    price: '1.500-5.000 TRY'
  },
  {
    name: 'Web Sitesi Tasarımı',
    description: 'Kurumsal veya e-ticaret site',
    deliverables: '1 site (tasarım + entegrasyon)',
    price: '15.000-75.000 TRY'
  },
  {
    name: 'SEO',
    description: 'Teknik + içerik optimizasyonu',
    deliverables: 'Aylık rapor + içerik planı',
    price: '5.000-20.000 TRY/ay'
  },
  {
    name: 'Reklam Yönetimi',
    description: 'Meta/Google/TikTok kampanyaları',
    deliverables: 'Aylık yönetim + optimizasyon',
    price: '5.000-20.000 TRY + reklam bütçesi'
  },
  {
    name: 'E-ticaret Entegrasyonu',
    description: 'Shop kurulumu + entegrasyon',
    deliverables: 'Instagram/TikTok Shop + ürün yükleme',
    price: '4.000-15.000 TRY'
  }
];

export const packages: Package[] = [
  {
    id: 'individual',
    title: 'Bireysel Kullanıcı',
    description: 'Kişisel hesaplar için profesyonel görünüm',
    target: 'Sosyal medyayı daha düzenli, estetik ve profesyonel kullanmak isteyen bireyler, kişisel marka oluşturmak isteyenler, hobi içerik üreticileri',
    modules: individualModules,
    pricing: '1.500-15.000 TRY',
    features: [
      '8-12 statik post tasarımı',
      '4-8 story şablonu',
      'Profil düzenleme ve optimizasyon',
      'Aylık içerik takvimi',
      'Caption ve hashtag setleri',
      'Mini video paketleri (opsiyonel)',
      'Kişisel marka danışmanlığı'
    ]
  },
  {
    id: 'influencer',
    title: 'Influencer Paketi',
    description: 'İçerik üreticileri ve marka işbirlikleri için',
    target: 'Gelir elde eden veya gelir hedefleyen içerik üreticileri, markalarla işbirliği yapanlar veya işbirliği sürecine hazırlananlar',
    modules: influencerModules,
    pricing: '5.000-40.000+ TRY',
    features: [
      'Bireysel paketin tüm özellikleri',
      'Marka işbirliği içerik üretimi',
      'Profesyonel medya kiti hazırlığı',
      'UGC içerik setleri',
      'Performans raporlama',
      'Video prodüksiyon (premium)',
      'Marka danışmanlığı ve kontrat desteği'
    ]
  },
  {
    id: 'business',
    title: 'İşletme Paketi',
    description: 'KOBİ\'den kurumsala tam çözüm',
    target: 'KOBİ\'den kurumsala kadar işletmeler, marka yönetimi, satış odaklı sosyal medya, SEO ve dijital büyüme hedefleri',
    modules: businessModules,
    pricing: '12.000-80.000+ TRY',
    features: [
      'Çoklu platform yönetimi',
      'Kapsamlı içerik üretimi (16-20+ post)',
      'Reklam yönetimi ve optimizasyon',
      'SEO ve web sitesi entegrasyonu',
      'E-ticaret entegrasyonu',
      'CRM ve otomasyon sistemleri',
      'Kriz iletişimi ve itibar yönetimi',
      'Detaylı raporlama ve dashboard'
    ]
  }
];

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