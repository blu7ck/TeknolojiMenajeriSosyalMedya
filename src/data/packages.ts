import { Package, ProcessStep } from '../types';

export const packages: Package[] = [
  {
    id: "individual",
    title: "Bireysel",
    description: "Kişisel hesaplar için profesyonel görünüm",
    target: "Sosyal medyayı daha düzenli, estetik ve profesyonel kullanmak isteyen bireyler, kişisel marka oluşturmak isteyenler, hobi içerik üreticileri",
    modules: [
      {
        id: "fenomen-paket",
        name: "Fenomen Paket",
        description: "Mentorluk + İçerik Üretimi (12 Fotoğraf + 2 Video)",
        exampleJson: '{"deliverables": "Profesyonel Seviyede 12 Fotoğraf + 2 Video | Sosyal Medya Eğitimi"}',
      },
      {
        id: "kisiye-ozel-icerik",
        name: "Kişiye Özel İçerik Üretimi",
        description: "Görsel",
        exampleJson: '{"deliverables": "4 Adet Görsel"}',
      },
      {
        id: "mini-video",
        name: "Mini Video",
        description: "Anılarınızı canlandırabilir, hayallerinizi gerçekleştirebilirsiniz :)",
        exampleJson: '{"deliverables": "1 Adet Video"}',
      },
      {
        id: "trend-ai-icerikler",
        name: "Trend AI İçerikler",
        description: "Sosyal Medya Viral İçerikleri",
        exampleJson: '{"deliverables": "Görsel | Video"}',
      },
    ],
  },
  {
    id: "influencer",
    title: "Influencer",
    description: "İçerik üreticileri ve marka işbirlikleri için",
    target: "Gelir elde eden veya gelir hedefleyen içerik üreticileri, markalarla işbirliği yapanlar veya işbirliği sürecine hazırlananlar",
    modules: [
      {
        id: "influencer-baslangic",
        name: "Infiluencer Başlangıç Paketi",
        description: "Danışmanlık + Profil Yönetimi + İçerik Takvimi + İçerik Üretimi + Hedef Kitle Analizi",
        exampleJson: '{"deliverables": "Aylık 2 Saat Danışmanlık Hizmeti + Profesyonel Seviyede 20 Fotoğraf + 4 Video + Anlık İletişim Hizmeti"}',
      },
      {
        id: "marka-isbirligi",
        name: "Marka İşbirliği İçerik Üretimi",
        description: "Görsel + Caption + Hashtag | Video + Caption + Hashtag",
        exampleJson: '{"deliverables": "Görsel | Video"}',
      },
      {
        id: "mini-video-platform",
        name: "Mini Video",
        description: "Reel, Story etc.",
        exampleJson: '{"deliverables": "1 Adet Video"}',
      },
      {
        id: "ugc-seti",
        name: "UGC Seti",
        description: "Sizin tarzınıza uygun kullanıcı içerikleri",
        exampleJson: '{"deliverables": "1 Adet UGC Video"}',
      },
    ],
  },
  {
    id: "corporate",
    title: "Kurumsal",
    description: "KOBİ'den kurumsala tam çözüm",
    target: "KOBİ'den kurumsala kadar işletmeler, marka yönetimi, satış odaklı sosyal medya, SEO ve dijital büyüme hedefleri",
    modules: [
      {
        id: "sosyal-medya-yonetimi",
        name: "Sosyal Medya Yönetimi",
        description: "Hesapların tam kapsamlı yönetimi",
        exampleJson: '{"deliverables": "1-3 platform yönetimi"}',
      },
      {
        id: "video-icerik-uretimi",
        name: "Video İçerik Üretimi",
        description: "Yapay Zeka destekli veya UE5 profesyonel video",
        exampleJson: '{"deliverables": "1 Adet Video"}',
      },
      {
        id: "web-sitesi-tasarimi",
        name: "Web Sitesi Tasarımı",
        description: "Kurumsal veya e-ticaret site",
        exampleJson: '{"deliverables": "Website"}',
      },
      {
        id: "kisisel-marka-danismanligi",
        name: "Kişisel Marka Danışmanlığı",
        description: "1 Saatlik Online Oturum",
        exampleJson: '{"deliverables": "Rapor"}',
      },
    ],
  },
]
  
  
export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Ücretsiz Dijital Analizinizi Yaptırın',
    description: 'Online platformlardaki ayak izinizi değerlendirerek, markanızın dijital varlığını nasıl geliştireceğiniz konusunda size özel öneriler sunuyoruz.'
  },
  {
    step: 2,
    title: 'İhtiyaçlarınızı Belirleyin/Belirleyelim',
    description: 'Hedefler, tone-of-voice, görsel referans ve erişim bilgilerinin alınması'
  },
  {
    step: 3,
    title: 'Modül Paket Seçimleri ve Fiyat Teklifi',
    description: 'Teklif gönderimi (paket + modüller) ve ihtiyaç analizi'
  },
  {
    step: 4,
    title: 'Sözleşme ve Ön Ödeme',
    description: 'Ön ödeme alımı ve sözleşme imzalama süreci'
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
