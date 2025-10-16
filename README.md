# Teknoloji Menajeri - Sosyal Medya Ajansı

Modern ve interaktif bir sosyal medya ajansı web sitesi. React, TypeScript, Vite ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- ✨ **Modern UI/UX**: Glassmorphism ve smooth animasyonlar
- 🎨 **3D Galeri**: Three.js ile infinite scroll 3D galeri
- 📝 **Blog Sistemi**: Supabase tabanlı dinamik blog
- 🌓 **Gece/Gündüz Modu**: Blog sayfasında tema değiştirme
- 📱 **Responsive Tasarım**: Tüm cihazlarda uyumlu
- 🔐 **Admin Panel**: Blog yönetimi için güvenli admin paneli
- 📧 **Newsletter**: E-posta abonelik sistemi

## 📦 Kurulum

### Gereksinimler
- Node.js 18.x veya üzeri
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd teknoloji-menajeri-sosyal-medya
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Supabase'i yapılandırın**
```bash
# .env dosyası oluşturun
# Windows PowerShell:
New-Item -Path .env -ItemType File

# .env dosyasının içeriği:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Detaylı Supabase kurulum adımları için `SUPABASE_SETUP.md` dosyasına bakın.

**Blog Görselleri İçin:**
Blog yazılarında kullanılacak görselleri Supabase Storage'a yükleyin:
- Adımlar için `STORAGE_SETUP.md` dosyasına bakın
- Storage bucket adı: `blog-images`
- Görseller herkese açık (public) olmalı

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Proje http://localhost:5173 adresinde çalışacaktır.

## 🎯 Kullanılabilir Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Üretim için projeyi derler
- `npm run preview` - Derlenmiş projeyi önizler
- `npm run lint` - Kod kalitesini kontrol eder

## 📄 Sayfalar

### Ana Sayfa (`/`)
- Hero section
- Hizmetler
- Paket seçici
- Hakkımızda
- İletişim formu
- 3D Galeri

### Blog Sayfası (`/blog`)
- Blog yazıları listesi
- Aylık gruplama
- Gece/Gündüz mod değiştirici (sağ üst köşe)
- Newsletter formu
- Blog detay modalı

### Admin Panel (`/admin`)
- Blog yazısı oluşturma/düzenleme
- Blog yazılarını yönetme
- Abone listesi görüntüleme

## 🔐 Admin Paneline Erişim

Admin paneli gizli bir URL ile korunmaktadır:

### Erişim Bilgileri
- **URL:** `http://localhost:5173/blu4ck`
- **Şifre:** `130113`

### Adımlar
1. Tarayıcınızda şu adresi açın: `http://localhost:5173/blu4ck`
2. Şifre ekranında `130113` girin
3. Supabase authentication ile giriş yapın (varsa)
4. Admin paneline erişim sağlanır

**Güvenlik Notu:** Bu şifre geliştirme amaçlıdır. Üretim ortamında mutlaka değiştirilmeli ve daha güvenli bir sistem kullanılmalıdır.

## 🌓 Gece/Gündüz Modu Kullanımı

Blog sayfasında (`/blog`):
1. Sayfanın sağ üst köşesindeki ay/güneş ikonuna tıklayın
2. Tema otomatik olarak değişecektir
3. Seçiminiz localStorage'da kaydedilir

## 🛠️ Teknolojiler

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **3D Graphics**: Three.js, React Three Fiber
- **Backend**: Supabase
- **Markdown**: react-markdown
- **Icons**: Lucide React

## 📁 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── admin/          # Admin panel bileşenleri
│   ├── blog/           # Blog bileşenleri
│   └── ...
├── pages/              # Sayfa bileşenleri
├── contexts/           # React context'leri
├── hooks/              # Custom hooks
├── lib/                # Yardımcı fonksiyonlar
│   └── supabase/       # Supabase client
├── types/              # TypeScript tipleri
└── data/               # Statik veri
```

## 🔧 Yapılandırma

### Supabase Kurulumu
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. `src/lib/supabase/client.ts` dosyasında API bilgilerinizi güncelleyin
4. `scripts/001_create_blog_tables.sql` dosyasını Supabase SQL Editor'de çalıştırın

### Environment Variables
`.env` dosyası oluşturun:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎨 Özelleştirme

### Renkler
`tailwind.config.js` ve `src/index.css` dosyalarından tema renklerini özelleştirebilirsiniz.

### Paketler
`src/data/packages.ts` dosyasından paket bilgilerini düzenleyebilirsiniz.

## 📝 Lisans

Bu proje özel bir projedir.

## 🤝 Katkıda Bulunma

Katkıda bulunmak isterseniz pull request gönderebilirsiniz.

## 📧 İletişim

Sorularınız için [iletişim formunu](http://localhost:5173/#contact) kullanabilirsiniz.

---

**Geliştirici Notu**: Proje yerel geliştirme için optimize edilmiştir. Üretim ortamına almadan önce gerekli güvenlik ve performans optimizasyonlarını yapınız.

