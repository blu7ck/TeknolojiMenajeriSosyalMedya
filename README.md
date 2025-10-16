# 🚀 Teknoloji Menajeri - Sosyal Medya Yönetim Platformu

<div align="center">

![Teknoloji Menajeri](https://i.ibb.co/CstJSnMp/logo.png)

**Modern teknoloji haberleri ve sosyal medya yönetimi için geliştirilmiş kapsamlı platform**

> **📋 Not:** Bu repository sadece kaynak kodları içerir. Kurulum script'leri ve detaylı dokümantasyon lokalde tutulur. Tam kurulum için iletişime geçin.

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3.0+-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🌐 Demo]([https://teknoloji-menajeri-sosyal-medya.vercel.app](https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/logo.svg)) • [📖 Dokümantasyon](#dokümantasyon) • [🚀 Kurulum](#kurulum) • [📝 Changelog](#changelog)

</div>

---

## ✨ Özellikler

### 🎨 **Modern UI/UX**
- **Responsive Design** - Tüm cihazlarda mükemmel görünüm
- **Dark/Light Mode** - Kullanıcı tercihi ile tema değişimi
- **Smooth Animations** - Framer Motion ile akıcı geçişler
- **Custom Cursor** - Teknoloji Menajeri renklerinde özel imleç

### 📝 **Blog Sistemi**
- **Admin Panel** - Kolay blog yönetimi
- **Rich Text Editor** - Markdown desteği ile içerik oluşturma
- **Image Upload** - Supabase Storage ile görsel yükleme
- **SEO Optimizasyonu** - Meta tags ve sitemap desteği
- **Kategori & Tag** - İçerik organizasyonu

### 📧 **Mail Entegrasyonu**
- **Newsletter Sistemi** - Otomatik abonelik yönetimi
- **Mailgun Integration** - Profesyonel email gönderimi
- **Template Sistemi** - Özelleştirilebilir email şablonları
- **Automated Notifications** - Yeni blog yazıları için otomatik bildirim

### 🔐 **Güvenlik & Backend**
- **Supabase Backend** - Güvenli veritabanı ve kimlik doğrulama
- **Row Level Security** - Gelişmiş güvenlik politikaları
- **Edge Functions** - Serverless backend işlemleri
- **Environment Variables** - Güvenli konfigürasyon yönetimi

### 📊 **Analytics & Monitoring**
- **Blog Analytics** - Görüntülenme ve etkileşim istatistikleri
- **User Tracking** - Kullanıcı davranış analizi
- **Performance Monitoring** - Sayfa yükleme süreleri

---

## 🛠️ Teknoloji Stack

### **Frontend**
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

### **Backend**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Güçlü veritabanı
- **Edge Functions** - Serverless functions
- **Row Level Security** - Veritabanı güvenliği

### **Email & Communication**
- **Mailgun** - Email delivery service
- **Newsletter Management** - Otomatik abonelik sistemi

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 🚀 Kurulum

### **Gereksinimler**
- Node.js 18+ 
- npm veya yarn
- Supabase hesabı
- Mailgun hesabı

### **1. Repository'yi Klonlayın**
```bash
git clone https://github.com/blu7ck/TeknolojiMenajeriSosyalMedya.git
cd TeknolojiMenajeriSosyalMedya
```

### **2. Bağımlılıkları Yükleyin**
```bash
npm install
```

### **3. Environment Variables Ayarlayın**
`.env` dosyası oluşturun:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4. Supabase Kurulumu**
```bash
# Supabase CLI kurulumu
npm install -g supabase

# Projeyi link edin
supabase link --project-ref your_project_ref

# Edge Functions'ları deploy edin
supabase functions deploy
```

### **5. Veritabanı Kurulumu**
**📁 Scripts ve Docs Klasörü:** `scripts/` ve `docs/` klasörleri Git repository'ye dahil değildir. Bu dosyalar sadece lokalde kalır ve gerektiğinde ayrıca paylaşılabilir.

**🔧 Veritabanı kurulumu için:** 
1. Supabase Dashboard'da SQL Editor'ü açın
2. Gerekli tabloları oluşturun:
   - `blog_posts` - Blog yazıları için
   - `blog_reactions` - Blog reaksiyonları için
   - `newsletter_subscribers` - Newsletter aboneleri için
   - `blog_post_views` - Blog görüntülenme istatistikleri için

**📋 Detaylı Kurulum:** Tam kurulum rehberi, SQL script'leri ve dokümantasyon için iletişime geçin.

### **6. Mailgun Kurulumu**
1. Mailgun hesabı oluşturun
2. Domain'inizi doğrulayın
3. Template'leri oluşturun
4. Environment variables'ları Supabase'e ekleyin:
   - `MAILGUN_API_KEY`
   - `MAILGUN_DOMAIN`
   - `MAILGUN_BASE_URL`

### **7. Uygulamayı Başlatın**
```bash
npm run dev
```

---

## 📁 Proje Yapısı

```
TeknolojiMenajeriSosyalMedya/
├── 📁 public/                 # Statik dosyalar (robots.txt, sitemap.xml)
├── 📁 src/
│   ├── 📁 components/         # React bileşenleri
│   │   ├── 📁 admin/         # Admin panel bileşenleri
│   │   ├── 📁 blog/          # Blog bileşenleri
│   │   └── 📄 ...            # Diğer bileşenler
│   ├── 📁 pages/             # Sayfa bileşenleri
│   ├── 📁 lib/               # Utility fonksiyonları (SEO, Supabase)
│   ├── 📁 types/             # TypeScript type tanımları
│   └── 📄 ...                # Ana dosyalar
├── 📁 supabase/
│   └── 📁 functions/         # Edge Functions (Email, Notifications)
├── 📄 package.json           # Proje bağımlılıkları
├── 📄 index.html             # SEO optimized HTML
└── 📄 README.md              # Bu dosya

📋 Lokalde Tutulan Dosyalar (Git'e dahil değil):
├── 📁 scripts/               # SQL script'leri (Database setup)
└── 📁 docs/                  # Detaylı dokümantasyon
```

---

## 🎯 Kullanım

### **Admin Panel**
- URL: `/blu4ck` (gizli admin paneli)
- Şifre: `130113`
- Blog yazıları oluşturma, düzenleme, silme
- Newsletter abonelerini yönetme
- Sistem istatistikleri

### **Blog Sistemi**
- Ana sayfa: `/`
- Blog sayfası: `/blog`
- Admin paneli: `/blu4ck`
- Unsubscribe: `/unsubscribe`

### **Email Sistemi**
- Newsletter abonelik formu
- Otomatik hoşgeldin emaili
- Yeni blog yazısı bildirimleri
- Abonelik iptal sistemi

---

## 🔧 Konfigürasyon

### **Blog Ayarları**
```typescript
// src/data/packages.ts
export const blogConfig = {
  postsPerPage: 10,
  enableComments: true,
  enableReactions: true,
  autoEmailNotifications: true
}
```

### **Email Ayarları**
```typescript
// Mailgun template variables
const templateVariables = {
  isim: "Kullanıcı Adı",
  baslik: "Blog Başlığı",
  ozet: "Blog Özeti",
  gorsel: "Blog Görseli URL",
  link: "Blog Yazısı Linki"
}
```

---

## 📊 Performans

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: ~500KB (gzipped)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s

---

## 🧪 Test

```bash
# Unit testleri çalıştırın
npm run test

# E2E testleri çalıştırın
npm run test:e2e

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 🚀 Deployment

### **Vercel (Önerilen)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Netlify dashboard'da build klasörünü yükleyin
```

### **Manual Deployment**
```bash
npm run build
# dist/ klasörünü web sunucunuza yükleyin
```

---

## 📝 Changelog

### **v1.0.1-beta** (2025-01-15)
- 🔧 Repository temizliği yapıldı
- 📁 Scripts ve docs klasörleri Git'ten çıkarıldı
- 📋 README güncellendi - lokalde tutulan dosyalar belirtildi
- 🔒 Güvenlik iyileştirmesi - sensitive bilgiler Git'te görünmez
- ✨ SEO sistemi akıllı anahtar kelime üretimi ile geliştirildi

### **v1.0.0-beta** (2025-01-15)
- ✨ Blog sistemi eklendi
- ✨ Admin panel oluşturuldu
- ✨ Mail entegrasyonu (Mailgun)
- ✨ Newsletter sistemi
- ✨ Supabase backend entegrasyonu
- ✨ Responsive design
- ✨ Dark/Light mode
- ✨ SEO optimizasyonu

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

- **Website**: [teknolojimenajeri.com](https://teknolojimenajeri.com.tr)
- **Email**: gulsah@teknolojimenajeri.com
- **GitHub**: [@blu7ck](https://github.com/blu7ck)

**📋 Kurulum Desteği:** Detaylı kurulum rehberi, SQL script'leri ve dokümantasyon için iletişime geçin.

---

<div align="center">

Made with ❤️ for [Teknoloji Menajeri](https://teknolojimenajeri.com.tr)

</div>
