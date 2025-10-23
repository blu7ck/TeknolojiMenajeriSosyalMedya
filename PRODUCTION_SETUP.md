# 🚀 Production Kurulum Rehberi

Bu rehber, PDF rapor sistemini production ortamında çalıştırmak için gerekli tüm adımları içerir.

---

## 📋 Kontrol Listesi

Kuruluma başlamadan önce şunlara ihtiyacınız var:

- [ ] Docker Desktop kurulu ve çalışıyor
- [ ] Node.js 18+ kurulu
- [ ] Supabase hesabı ve proje
- [ ] Mailgun hesabı (email için)
- [ ] Google Cloud hesabı (PageSpeed API için)
- [ ] GitHub hesabı (Gist backup için - opsiyonel)
- [ ] reCAPTCHA v3 site key (form koruması için)

---

## 1️⃣ ADIM 1: Docker Servisini Başlatın

### 1.1 Docker Desktop'ı Açın

Windows'ta Docker Desktop'ı başlatın ve çalıştığından emin olun.

### 1.2 Gotenberg Servisini Başlatın

Terminal'de proje dizinine gidin ve:

```bash
cd C:\Users\blu4c\Downloads\teknoloji-menajeri-sosyal-medyamain

# Gotenberg servisini başlatın
docker-compose up -d

# Çalıştığını kontrol edin
docker ps
```

**Beklenen Çıktı:**
```
CONTAINER ID   IMAGE                    STATUS         PORTS
abc123def456   gotenberg/gotenberg:8    Up 10 seconds  127.0.0.1:3000->3000/tcp
```

### 1.3 Health Check

```bash
curl http://localhost:3000/health
```

**Beklenen Yanıt:**
```json
{"status":"up"}
```

✅ **Checkpoint:** Gotenberg servisi çalışıyor!

---

## 2️⃣ ADIM 2: Frontend Environment Variables (.env)

### 2.1 .env Dosyası Oluşturun

Proje kök dizininde `.env` dosyası oluşturun:

```bash
# Windows PowerShell
New-Item -Path .env -ItemType File

# veya manuel olarak dosya oluşturun
```

### 2.2 Supabase Bilgilerini Alın

1. **Supabase Dashboard'a gidin:** https://supabase.com/dashboard
2. Projenizi seçin
3. **Settings** > **API** bölümüne gidin
4. Aşağıdaki bilgileri kopyalayın:
   - **Project URL** (URL kısmında)
   - **anon public** key

### 2.3 reCAPTCHA Key Alın

1. **Google reCAPTCHA Console:** https://www.google.com/recaptcha/admin
2. **Yeni site ekle:**
   - Label: "Teknoloji Menajeri"
   - reCAPTCHA type: **reCAPTCHA v3**
   - Domains: `localhost`, `teknolojimenajeri.com.tr`
3. **Site Key**'i kopyalayın

### 2.4 .env Dosyasını Doldurun

`.env` dosyasını açın ve şunları ekleyin:

```env
# Supabase Frontend Config
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
```

**Gerçek değerlerinizi girin!**

✅ **Checkpoint:** Frontend environment variables hazır!

---

## 3️⃣ ADIM 3: Supabase Storage Bucket Oluşturun

### 3.1 Storage Bucket Oluşturun

1. **Supabase Dashboard** > **Storage**
2. **New Bucket** butonuna tıklayın
3. Ayarlar:
   ```
   Name: digital-analysis-reports
   Public bucket: ✅ Evet
   File size limit: 5 MB
   Allowed MIME types: application/pdf, text/markdown
   ```
4. **Create bucket** butonuna tıklayın

### 3.2 RLS Policy Oluşturun (Opsiyonel - Public Bucket)

Public bucket olduğu için herkes okuyabilir, ancak sadece authenticated kullanıcılar yükleyebilir:

```sql
-- Storage RLS Policy
-- Supabase Dashboard > Storage > digital-analysis-reports > Policies

-- Policy 1: Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'digital-analysis-reports');

-- Policy 2: Service role can insert
CREATE POLICY "Service Role Insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'digital-analysis-reports');
```

✅ **Checkpoint:** Storage bucket hazır!

---

## 4️⃣ ADIM 4: Google API Keys

### 4.1 Google Cloud Console'a Gidin

1. **Google Cloud Console:** https://console.cloud.google.com
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. **APIs & Services** > **Library**

### 4.2 PageSpeed Insights API'yi Aktifleştirin

1. "PageSpeed Insights API" aratın
2. **Enable** butonuna tıklayın
3. **Credentials** > **Create Credentials** > **API Key**
4. API Key'i kopyalayın ve kaydedin

### 4.3 Gemini API Key Alın

1. **Google AI Studio:** https://makersuite.google.com/app/apikey
2. **Create API Key** butonuna tıklayın
3. API Key'i kopyalayın ve kaydedin

**Not:** Gemini API ücretsiz tier'da günlük 15 request limiti var.

✅ **Checkpoint:** Google API keys hazır!

---

## 5️⃣ ADIM 5: Mailgun Setup

### 5.1 Mailgun Hesabı Oluşturun

1. **Mailgun:** https://www.mailgun.com
2. Ücretsiz trial hesap oluşturun
3. Domain'inizi ekleyin ve doğrulayın (DNS kayıtları)

### 5.2 API Credentials Alın

1. **Mailgun Dashboard** > **Settings** > **API Keys**
2. **Private API key**'i kopyalayın
3. **Domain**'inizi not edin (örn: `mg.teknolojimenajeri.com.tr`)

### 5.3 Email Templates Oluşturun

#### Template 1: Welcome Email
```
Mailgun Dashboard > Sending > Templates > Create Template

Name: welcome_corporate_tr
Subject: Teknoloji Menajeri Blog'a Hoş Geldiniz!

Template:
<!DOCTYPE html>
<html>
<body>
  <h1>Merhaba %recipient.isim%!</h1>
  <p>Teknoloji Menajeri Blog'a hoş geldiniz...</p>
</body>
</html>
```

#### Template 2: New Post Notification
```
Name: new_post_notification_tr
Subject: Yeni Blog Yazısı: %recipient.baslik%

Template:
<!DOCTYPE html>
<html>
<body>
  <h1>%recipient.baslik%</h1>
  <p>%recipient.ozet%</p>
  <a href="%recipient.link%">Devamını Oku</a>
</body>
</html>
```

#### Template 3: Analysis Report
```
Name: analysis_report
Subject: Dijital Analiz Raporunuz Hazır!

Template:
<!DOCTYPE html>
<html>
<body>
  <h1>Merhaba %recipient.name%!</h1>
  <p>%recipient.website% için dijital analiz raporunuz hazır.</p>
  <a href="%recipient.pdf_url%">Raporu İndir (PDF)</a>
</body>
</html>
```

✅ **Checkpoint:** Mailgun hazır!

---

## 6️⃣ ADIM 6: GitHub Token (Opsiyonel - Gist Backup)

### 6.1 Personal Access Token Oluşturun

1. **GitHub:** https://github.com/settings/tokens
2. **Generate new token (classic)**
3. Permissions:
   - ✅ `gist` - Create gists
4. Token'ı kopyalayın ve kaydedin

**Not:** Bu opsiyonel - Markdown raporların GitHub Gist'e backup'ı için.

✅ **Checkpoint:** GitHub token hazır (opsiyonel)!

---

## 7️⃣ ADIM 7: Supabase Edge Functions Secrets

### 7.1 Supabase CLI Kurulumu

```bash
# npm ile kurulum
npm install -g supabase

# Versiyonu kontrol edin
supabase --version
```

### 7.2 Supabase Projesine Login Olun

```bash
# Login
supabase login

# Projeyi link edin
supabase link --project-ref YOUR_PROJECT_REF
```

**Project REF:** Supabase Dashboard URL'inden alın (örn: `rqhrjhgcoonsvzjwlega`)

### 7.3 Secrets'ları Ekleyin

Şimdi topladığınız tüm bilgileri Supabase'e ekleyeceğiz:

```bash
# 1. Gotenberg URL
supabase secrets set GOTENBERG_URL=http://host.docker.internal:3000

# 2. Mailgun
supabase secrets set MAILGUN_API_KEY=YOUR_MAILGUN_API_KEY
supabase secrets set MAILGUN_DOMAIN=YOUR_MAILGUN_DOMAIN

# 3. Google APIs
supabase secrets set GOOGLE_PAGESPEED_API_KEY=YOUR_PAGESPEED_KEY
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY

# 4. GitHub (Opsiyonel)
supabase secrets set GITHUB_TOKEN=YOUR_GITHUB_TOKEN

# 5. Supabase Internal (Otomatik - kontrol edin)
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 7.4 Service Role Key'i Alın

1. **Supabase Dashboard** > **Settings** > **API**
2. **service_role** key'i kopyalayın (secret key)
3. Yukarıdaki komutta kullanın

### 7.5 Secrets'ları Kontrol Edin

```bash
# Tüm secrets'ları listeleyin
supabase secrets list
```

**Beklenen Çıktı:**
```
GOTENBERG_URL
MAILGUN_API_KEY
MAILGUN_DOMAIN
GOOGLE_PAGESPEED_API_KEY
GEMINI_API_KEY
GITHUB_TOKEN
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

✅ **Checkpoint:** Tüm secrets eklendi!

---

## 8️⃣ ADIM 8: Edge Functions Deploy

### 8.1 Edge Functions'ları Deploy Edin

```bash
# Tüm functions'ları deploy edin
supabase functions deploy

# Veya tek tek:
supabase functions deploy analyze-website
supabase functions deploy send-email
supabase functions deploy send-new-post-notification
supabase functions deploy send-welcome-email
supabase functions deploy verify-recaptcha
```

### 8.2 Deployment'ı Kontrol Edin

1. **Supabase Dashboard** > **Edge Functions**
2. Tüm functions'ların **deployed** olduğunu görmelisiniz
3. Son deployment zamanını kontrol edin

✅ **Checkpoint:** Edge Functions deploy edildi!

---

## 9️⃣ ADIM 9: Veritabanı Tabloları

### 9.1 Digital Analysis Requests Tablosu

Supabase Dashboard > SQL Editor:

```sql
-- Digital Analysis Requests Table
CREATE TABLE IF NOT EXISTS digital_analysis_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
  ip_address TEXT,
  user_agent TEXT,
  recaptcha_token TEXT,
  recaptcha_score FLOAT,
  reject_reason TEXT,
  
  -- Analysis Data
  analysis_data JSONB,
  report_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Index for faster queries
CREATE INDEX idx_digital_analysis_status ON digital_analysis_requests(status);
CREATE INDEX idx_digital_analysis_created ON digital_analysis_requests(created_at DESC);
CREATE INDEX idx_digital_analysis_email ON digital_analysis_requests(email);

-- RLS Policies
ALTER TABLE digital_analysis_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert (form submission)
CREATE POLICY "Public can insert requests"
ON digital_analysis_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users can read their own
CREATE POLICY "Users can read own requests"
ON digital_analysis_requests FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');

-- Service role can do everything
CREATE POLICY "Service role full access"
ON digital_analysis_requests
TO service_role
USING (true)
WITH CHECK (true);
```

### 9.2 Diğer Gerekli Tablolar

Eğer yoksa, blog ve newsletter tabloları da oluşturun. Hali hazırda mevcutsa bu adımı atlayın.

✅ **Checkpoint:** Database tabloları hazır!

---

## 🔟 ADIM 10: Test ve Doğrulama

### 10.1 Frontend'i Başlatın

```bash
npm run dev
```

**Beklenen:** `http://localhost:5173` açılmalı

### 10.2 Servis Kontrolü

Her servisi test edin:

#### ✅ Test 1: Gotenberg
```bash
curl http://localhost:3000/health
```

#### ✅ Test 2: Supabase Bağlantısı
Frontend'de browser console'da hata olmamalı

#### ✅ Test 3: Dijital Analiz Formu
1. Ana sayfaya gidin
2. "Ücretsiz Dijital Analizinizi Yaptırın" bölümünü bulun
3. Formu doldurun:
   - Ad-Soyad: Test User
   - Email: test@example.com
   - Website: https://example.com
4. "Rapor İste" butonuna tıklayın
5. Başarılı mesaj görmeli

#### ✅ Test 4: Admin Panel
1. `/blu4ck` adresine gidin
2. Şifre: `130113`
3. "Dijital Analiz Talepleri" sekmesine tıklayın
4. Az önce oluşturduğunuz talebi görmelisiniz

#### ✅ Test 5: PDF Oluşturma
1. Admin panelde talebi **Onayla**
2. **Analizi Başlat** butonuna tıklayın
3. İşlem ~30 saniye sürebilir
4. Status "Completed" olmalı
5. "Raporu Görüntüle" butonu görünmeli

#### ✅ Test 6: PDF İndirme
1. "Raporu Görüntüle" butonuna tıklayın
2. PDF yeni sekmede açılmalı
3. Profesyonel branded rapor görmelisiniz

### 10.3 Log Kontrolü

#### Gotenberg Logs
```bash
docker logs gotenberg-pdf-service
```

#### Edge Function Logs
Supabase Dashboard > Edge Functions > analyze-website > Logs

**Başarılı akış:**
```
🔍 Starting analysis for: https://example.com
✅ Performance analysis completed
✅ SEO analysis completed
✅ Social media analysis completed
✅ AI insights generated
✅ Markdown report generated
📝 Generating PDF report with Gotenberg...
📤 Sending HTML to Gotenberg at: http://host.docker.internal:3000
✅ PDF generated successfully, size: 245678 bytes
✅ PDF uploaded to Supabase Storage
✅ Analysis completed and saved to database
✅ Report email sent to user
```

✅ **Checkpoint:** Tüm testler başarılı!

---

## 📊 Production Checklist

Tamamladığınız her maddeyi işaretleyin:

### Environment Variables
- [ ] Frontend `.env` dosyası oluşturuldu
- [ ] `VITE_SUPABASE_URL` ayarlandı
- [ ] `VITE_SUPABASE_ANON_KEY` ayarlandı
- [ ] `VITE_RECAPTCHA_SITE_KEY` ayarlandı

### Docker
- [ ] Docker Desktop kurulu ve çalışıyor
- [ ] `docker-compose up -d` çalıştırıldı
- [ ] Gotenberg health check başarılı

### Supabase Setup
- [ ] Storage bucket oluşturuldu
- [ ] Database tabloları oluşturuldu
- [ ] RLS policies aktif

### API Keys
- [ ] Google PageSpeed API key alındı
- [ ] Google Gemini API key alındı
- [ ] GitHub token oluşturuldu (opsiyonel)

### Mailgun
- [ ] Mailgun hesabı oluşturuldu
- [ ] Domain doğrulandı
- [ ] API key alındı
- [ ] Email templates oluşturuldu

### Supabase Secrets
- [ ] `GOTENBERG_URL` eklendi
- [ ] `MAILGUN_API_KEY` eklendi
- [ ] `MAILGUN_DOMAIN` eklendi
- [ ] `GOOGLE_PAGESPEED_API_KEY` eklendi
- [ ] `GEMINI_API_KEY` eklendi
- [ ] `GITHUB_TOKEN` eklendi (opsiyonel)
- [ ] `SUPABASE_URL` eklendi
- [ ] `SUPABASE_SERVICE_ROLE_KEY` eklendi

### Deployment
- [ ] Edge Functions deploy edildi
- [ ] Frontend başlatıldı
- [ ] Test formu gönderildi
- [ ] PDF başarıyla oluşturuldu

---

## 🎉 Tebrikler!

Sistem production seviyesinde çalışıyor! 🚀

### Sonraki Adımlar

1. **Production Domain:** Vercel/Netlify'a deploy edin
2. **Monitoring:** Sentry/LogRocket ekleyin
3. **Analytics:** Google Analytics entegre edin
4. **Backup:** Otomatik database backup
5. **SSL:** Domain için SSL sertifikası

---

## 🆘 Sorun mu var?

### Sık Karşılaşılan Sorunlar

**1. Gotenberg'e erişilemiyor**
```bash
# Windows'ta Docker Desktop'ın çalıştığından emin olun
docker ps

# Servisi yeniden başlatın
docker-compose restart
```

**2. PDF oluşturulmuyor**
```bash
# Logs kontrolü
docker logs gotenberg-pdf-service

# Supabase Edge Function logs
# Dashboard > Edge Functions > Logs
```

**3. Email gitmiyor**
- Mailgun domain doğrulandı mı?
- Templates oluşturuldu mu?
- MAILGUN_API_KEY doğru mu?

**4. Storage upload hatası**
- Bucket oluşturuldu mu?
- Public olarak ayarlandı mı?
- RLS policies doğru mu?

### Destek

- **Email:** gulsah@teknolojimenajeri.com
- **Dokümantasyon:** `SETUP_PDF_SERVICE.md`
- **GitHub Issues:** Repository'de issue açın

---

*Kurulum Tarihi: 2025-10-22*  
*Teknoloji Menajeri - PDF Rapor Sistemi*


