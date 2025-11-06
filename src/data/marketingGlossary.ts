export type MarketingTerm = {
  slug: string
  heading: string
  englishHeading?: string
  descriptionTR: string
  descriptionEN: string
  keywords: string[]
}

export const marketingGlossary: MarketingTerm[] = [
  {
    slug: "seo",
    heading: "SEO",
    englishHeading: "Search Engine Optimization",
    descriptionTR:
      "Arama motorlarında görünürlüğü artırmak için içerik, teknik yapı ve bağlantıları optimize eden uzun soluklu süreç.",
    descriptionEN:
      "A long-game process that tunes your content, technical setup, and backlinks so search engines actually find and trust you.",
    keywords: ["arama motoru optimizasyonu", "organik trafik", "technical seo"],
  },
  {
    slug: "sem",
    heading: "SEM",
    englishHeading: "Search Engine Marketing",
    descriptionTR:
      "Arama motorlarında reklam vererek hızlı görünürlük elde etmeyi hedefleyen, genelde PPC kampanyalarıyla yürütülen strateji.",
    descriptionEN:
      "Paid search campaigns that buy you instant visibility on the results page while organic SEO warms up in the background.",
    keywords: ["arama motoru reklamcılığı", "google ads", "paid search"],
  },
  {
    slug: "smm",
    heading: "SMM",
    englishHeading: "Social Media Marketing",
    descriptionTR:
      "Marka mesajını sosyal platformlarda içerik, topluluk yönetimi ve reklamlarla güçlendiren bütüncül yaklaşım.",
    descriptionEN:
      "The mix of content, community care, and paid boosts that keeps your brand buzzing across social platforms.",
    keywords: ["sosyal medya yönetimi", "topluluk", "paid social"],
  },
  {
    slug: "ppc",
    heading: "PPC",
    englishHeading: "Pay Per Click",
    descriptionTR:
      "Kullanıcı tıkladığında ücret ödediğiniz, ölçümü net dijital reklam modeli; bütçe disiplinini şart koşar.",
    descriptionEN:
      "A digital ad model where you pay only when the click happens, so every creative needs to earn its keep.",
    keywords: ["tıklama başı maliyet", "paid media", "kampanya"],
  },
  {
    slug: "cpc-cpm",
    heading: "CPC / CPM",
    englishHeading: "Cost Per Click / Cost Per Mille",
    descriptionTR:
      "CPC tıklama başına, CPM ise bin gösterim başına ödediğiniz tutarı ifade eden temel reklam fiyatlama metrikleri.",
    descriptionEN:
      "CPC tracks what each click costs you; CPM tells the price for a thousand impressions—choose by campaign goal.",
    keywords: ["reklam metriği", "bütçe", "gösterim"],
  },
  {
    slug: "ctr",
    heading: "CTR",
    englishHeading: "Click Through Rate",
    descriptionTR:
      "Gösterimlerin yüzde kaçının tıklamaya döndüğünü gösteren oran; kreatifin cazibesinin hızlı bir barometresi.",
    descriptionEN:
      "The percentage of impressions that win a click—your quick barometer for how irresistible the creative really is.",
    keywords: ["tıklama oranı", "performans", "analitik"],
  },
  {
    slug: "crm",
    heading: "CRM",
    englishHeading: "Customer Relationship Management",
    descriptionTR:
      "Müşteri etkileşimlerini kayıt altına alıp kişiselleştirilmiş deneyimler sunmayı sağlayan süreç ve yazılım ekosistemi.",
    descriptionEN:
      "The process and platform combo that keeps every customer interaction logged, loved, and ready for smart follow-ups.",
    keywords: ["müşteri yönetimi", "otomasyon", "sadakat"],
  },
  {
    slug: "cro",
    heading: "CRO",
    englishHeading: "Conversion Rate Optimization",
    descriptionTR:
      "Ziyaretçilerin istenen aksiyonu alma oranını artırmak için deneysel testler ve mikro iyileştirmeler bütünü.",
    descriptionEN:
      "Experiments and micro-tweaks designed to turn more visitors into takers of your desired action.",
    keywords: ["dönüşüm", "a/b testi", "kullanıcı deneyimi"],
  },
  {
    slug: "roi",
    heading: "ROI",
    englishHeading: "Return on Investment",
    descriptionTR:
      "Yatırımdan elde edilen kazancı gösteren oran; pazarlama harcamalarının masaya değer katıp katmadığını kanıtlar.",
    descriptionEN:
      "The metric that shows how much value your spend actually returns, separating smart bets from nice-to-haves.",
    keywords: ["yatırım getirisi", "finans", "performans"],
  },
  {
    slug: "kpi",
    heading: "KPI",
    englishHeading: "Key Performance Indicator",
    descriptionTR:
      "Stratejik hedeflere ilerlemeyi takip eden ölçülebilir göstergeler; takımınıza pusula görevi görür.",
    descriptionEN:
      "The measurable signals that tell everyone whether the strategy is actually moving the needle.",
    keywords: ["performans göstergesi", "hedef", "ölçüm"],
  },
  {
    slug: "automation",
    heading: "Automation",
    englishHeading: "Marketing Automation",
    descriptionTR:
      "Tekrarlayan pazarlama görevlerini tetikleyici kurallarla otomatikleştiren yapılar; ölçeklenebilirlik sağlar.",
    descriptionEN:
      "Rule-based workflows that automate repetitive marketing tasks so teams can scale without burning out.",
    keywords: ["otomasyon", "workflow", "trigger"],
  },
  {
    slug: "content-strategy",
    heading: "Content Strategy",
    descriptionTR:
      "Markanın hikayesini doğru format ve kanallarla anlatmak için planlanan uzun vadeli içerik çerçevesi.",
    descriptionEN:
      "A long-term blueprint for telling your brand story with the right formats, channels, and timing.",
    keywords: ["içerik planı", "storytelling", "kanal"],
  },
  {
    slug: "content-calendar",
    heading: "Content Calendar",
    descriptionTR:
      "İçeriklerin ne zaman, hangi kanalda ve hangi mesajla yayınlanacağını düzenleyen operasyonel takvim.",
    descriptionEN:
      "An operational schedule that maps every piece of content to its channel, message, and publish date.",
    keywords: ["içerik takvimi", "planlama", "yayın"],
  },
  {
    slug: "influencer-marketing",
    heading: "Influencer Marketing",
    descriptionTR:
      "Topluluğu olan içerik üreticileriyle iş birliği yaparak markanın güvenilirliğini ve erişimini artırma sanatı.",
    descriptionEN:
      "Partnering with creators who have loyal audiences to borrow their trust and extend your reach.",
    keywords: ["iş birliği", "topluluk", "creator"],
  },
  {
    slug: "ugc",
    heading: "UGC",
    englishHeading: "User Generated Content",
    descriptionTR:
      "Topluluğunuz tarafından üretilen, markanın otantik yüzünü göstererek sosyal kanıt sağlayan içerikler.",
    descriptionEN:
      "Community-made content that delivers raw authenticity and instant social proof for your brand.",
    keywords: ["kullanıcı içeriği", "sosyal kanıt", "topluluk"],
  },
  {
    slug: "brand-awareness",
    heading: "Brand Awareness",
    descriptionTR:
      "Hedef kitlenin markayı tanıma ve hatırlama düzeyi; uzun vadeli sadakatin ilk kilometre taşı.",
    descriptionEN:
      "How easily your target audience recognizes and recalls your brand—the foundation of long-term loyalty.",
    keywords: ["marka bilinirliği", "farkındalık", "funnel"],
  },
  {
    slug: "analytics",
    heading: "Analytics",
    descriptionTR:
      "Verileri toplayıp anlamlandırarak stratejik kararları güçlendiren ölçümleme disiplini.",
    descriptionEN:
      "The measurement discipline that turns raw data into smart, strategy-shaping insights.",
    keywords: ["veri analizi", "raporlama", "dashboard"],
  },
  {
    slug: "google-ads",
    heading: "Google Ads",
    descriptionTR:
      "Google ekosisteminde arama, görüntülü reklam ve YouTube üzerinden hedefli kampanyalar oluşturmanızı sağlayan reklam platformu.",
    descriptionEN:
      "Google’s ad platform for orchestrating targeted campaigns across search, display, and YouTube.",
    keywords: ["google reklam", "arama ağı", "youtube"],
  },
  {
    slug: "meta-ads",
    heading: "Meta Ads",
    descriptionTR:
      "Facebook, Instagram ve Audience Network üzerinde davranışsal hedeflemeyle reklam sunan Meta reklam yöneticisi.",
    descriptionEN:
      "Meta’s ad suite that serves behavior-based campaigns across Facebook, Instagram, and the Audience Network.",
    keywords: ["facebook ads", "instagram ads", "audience network"],
  },
  {
    slug: "tracking-pixel",
    heading: "Tracking Pixel",
    descriptionTR:
      "Kullanıcı davranışını ölçmek için siteye yerleştirilen, kampanyalara dönüşüm verisi sağlayan küçük kod parçacığı.",
    descriptionEN:
      "A tiny snippet of code that listens to user behavior on-site and feeds conversion data back to your campaigns.",
    keywords: ["dönüşüm takibi", "piksel", "ölçüm"],
  },
  {
    slug: "remarketing",
    heading: "Remarketing / Retargeting",
    descriptionTR:
      "Siteyi ziyaret edip aksiyon almayan kullanıcılara yeniden reklam göstererek onları huninin içine geri çağırma taktiği.",
    descriptionEN:
      "Showing tailored ads to visitors who bounced before converting, nudging them back into your funnel.",
    keywords: ["yeniden pazarlama", "retargeting", "funnel"],
  },
  {
    slug: "geo-seo",
    heading: "GEO SEO / Local SEO",
    descriptionTR:
      "Fiziksel konuma bağlı aramalarda öne çıkmak için Google Business profili ve yerel anahtar kelimelerle optimize etme süreci.",
    descriptionEN:
      "Optimizing for location-based searches with Google Business profiles and local intent keywords.",
    keywords: ["yerel seo", "google business", "harita"],
  },
  {
    slug: "omnichannel",
    heading: "Omnichannel Marketing (OMY)",
    descriptionTR:
      "Tüm temas noktalarında tutarlı deneyim sunmak için çevrim içi ve çevrim dışı kanalları entegre eden strateji.",
    descriptionEN:
      "A strategy that syncs online and offline touchpoints so customers feel the same brand heartbeat everywhere.",
    keywords: ["çok kanallı", "müşteri deneyimi", "entegrasyon"],
  },
  {
    slug: "ai-marketing",
    heading: "AI Marketing / Automation",
    descriptionTR:
      "Yapay zekâyı kullanarak tahminleme, segmentasyon ve içerik üretimini hızlandıran akıllı pazarlama uygulamaları.",
    descriptionEN:
      "Intelligent marketing that taps AI for predictions, segmentation, and accelerated content creation.",
    keywords: ["yapay zeka", "makine öğrenimi", "otomasyon"],
  },
  {
    slug: "brand-positioning",
    heading: "Brand Positioning",
    descriptionTR:
      "Markanın rakiplerden nasıl farklılaştığını ve kime hitap ettiğini kristal netliğinde tanımlayan stratejik çatı.",
    descriptionEN:
      "The strategic statement that clarifies who you serve, how you differ, and why anyone should care.",
    keywords: ["konumlandırma", "değer önerisi", "marka stratejisi"],
  },
  {
    slug: "digital-strategy",
    heading: "Digital Strategy",
    descriptionTR:
      "Dijital kanallarda hedefe ulaşmak için hedef kitle, mesaj ve taktikleri senkronize eden üst düzey yol haritası.",
    descriptionEN:
      "The high-level roadmap that aligns audience, messaging, and tactics across every digital channel.",
    keywords: ["dijital plan", "kanal stratejisi", "roadmap"],
  },
  {
    slug: "risk-yonetimi",
    heading: "Risk Yönetimi",
    englishHeading: "Risk Management",
    descriptionTR:
      "Markanın karşılaşabileceği finansal, operasyonel ve itibari riskleri öngörüp azaltmaya odaklanan bütünleşik yönetim süreci.",
    descriptionEN:
      "An integrated management practice focused on predicting and minimizing financial, operational, and reputational threats to the brand.",
    keywords: ["risk yönetimi", "kriz senaryosu", "önleyici strateji"],
  },
  {
    slug: "itibar-temizligi",
    heading: "İtibar Temizliği",
    englishHeading: "Reputation Cleanup",
    descriptionTR:
      "Olumsuz dijital izleri analiz ederek SEO, içerik üretimi ve PR hamleleriyle markanın algısını yeniden inşa etme çalışmaları.",
    descriptionEN:
      "The SEO, content, and PR effort that analyses negative digital traces and rebuilds brand perception from the ground up.",
    keywords: ["itibar yönetimi", "online reputation", "kriz iletişimi"],
  },
]

