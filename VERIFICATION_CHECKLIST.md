# ✅ Sistem Doğrulama ve Test Checklist

Bu dosya, PDF rapor sisteminin doğru çalıştığını kontrol etmek için kullanılır.

---

## 1️⃣ DOCKER SERVİSİ KONTROLÜ

### Komut 1: Docker Container Durumu
```bash
docker ps
```

**Beklenen Çıktı:**
```
CONTAINER ID   IMAGE                    STATUS         PORTS
abc123         gotenberg/gotenberg:8    Up X minutes   127.0.0.1:3000->3000/tcp
```

✅ **Kontrol:** `gotenberg-pdf-service` çalışıyor mu?

### Komut 2: Health Check
```bash
curl http://localhost:3000/health
```

**Beklenen Çıktı:**
```json
{"status":"up"}
```

✅ **Kontrol:** Gotenberg servisi yanıt veriyor mu?

### Komut 3: Container Logs
```bash
docker logs --tail 50 gotenberg-pdf-service
```

✅ **Kontrol:** Hata mesajı var mı?

---

## 2️⃣ SUPABASE SECRETS KONTROLÜ

### Komut: Secrets Listesi
```bash
cd C:\Users\blu4c\Downloads\teknoloji-menajeri-sosyal-medyamain
supabase secrets list
```

**Beklenen Secrets:**
```
GOTENBERG_URL
MAILGUN_API_KEY
MAILGUN_DOMAIN
GOOGLE_PAGESPEED_API_KEY
GEMINI_API_KEY
GITHUB_TOKEN (opsiyonel)
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

✅ **Kontrol:** Tüm secrets mevcut mu?

### Eğer Secrets Yoksa:
```bash
# Supabase login
supabase login

# Project link
supabase link --project-ref YOUR_PROJECT_REF

# Secrets ekle (değerleri doldurun)
supabase secrets set GOTENBERG_URL=http://host.docker.internal:3000
supabase secrets set MAILGUN_API_KEY=YOUR_KEY
supabase secrets set MAILGUN_DOMAIN=YOUR_DOMAIN
supabase secrets set GOOGLE_PAGESPEED_API_KEY=YOUR_KEY
supabase secrets set GEMINI_API_KEY=YOUR_KEY
supabase secrets set SUPABASE_URL=YOUR_SUPABASE_URL
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_KEY
```

---

## 3️⃣ EDGE FUNCTIONS DEPLOYMENT

### Komut: Functions Deploy
```bash
supabase functions deploy
```

**Veya tek tek:**
```bash
supabase functions deploy analyze-website
supabase functions deploy send-email
supabase functions deploy verify-recaptcha
```

✅ **Kontrol:** Deployment başarılı mı?

### Supabase Dashboard Kontrolü
1. https://supabase.com/dashboard açın
2. Projenizi seçin
3. **Edge Functions** bölümüne gidin
4. **analyze-website** function'ı var mı?
5. Son deployment zamanı güncel mi?

---

## 4️⃣ STORAGE BUCKET KONTROLÜ

### Supabase Dashboard
1. **Storage** bölümüne gidin
2. **digital-analysis-reports** bucket'ı var mı?
3. Public olarak ayarlandı mı?

### Eğer Bucket Yoksa Oluşturun:
```sql
-- Supabase Dashboard > Storage > Create Bucket
Name: digital-analysis-reports
Public: Yes
File size limit: 5 MB
Allowed MIME types: application/pdf, text/markdown
```

✅ **Kontrol:** Bucket mevcut ve public mu?

---

## 5️⃣ DATABASE TABLOSU KONTROLÜ

### Komut: SQL Query
Supabase Dashboard > SQL Editor:

```sql
-- Tablo var mı kontrol et
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'digital_analysis_requests'
);
```

**Beklenen:** `true`

### Eğer Tablo Yoksa Oluşturun:
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
  analysis_data JSONB,
  report_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_digital_analysis_status ON digital_analysis_requests(status);
CREATE INDEX IF NOT EXISTS idx_digital_analysis_created ON digital_analysis_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_digital_analysis_email ON digital_analysis_requests(email);

-- RLS
ALTER TABLE digital_analysis_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY IF NOT EXISTS "Public can insert requests"
ON digital_analysis_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access"
ON digital_analysis_requests
TO service_role
USING (true)
WITH CHECK (true);
```

✅ **Kontrol:** Tablo ve policies mevcut mu?

---

## 6️⃣ FRONTEND TEST

### Komut: Dev Server Başlat
```bash
npm run dev
```

**Beklenen:** Server `http://localhost:5173` adresinde çalışmalı

### Browser Kontrolü
1. http://localhost:5173 açın
2. Console'da hata var mı? (F12 > Console)
3. Network tab'de Supabase bağlantısı başarılı mı?

✅ **Kontrol:** Frontend düzgün yükleniyor mu?

---

## 7️⃣ END-TO-END TEST

### Test 1: Dijital Analiz Formu Gönderimi

1. Ana sayfaya gidin: http://localhost:5173
2. "Ücretsiz Dijital Analizinizi Yaptırın" bölümünü bulun
3. Formu doldurun:
   - **Ad-Soyad:** Test User
   - **Email:** test@example.com
   - **Website:** https://example.com
4. **"Rapor İste"** butonuna tıklayın

**Beklenen:** ✅ "Talebiniz başarıyla alındı!" mesajı

### Test 2: Admin Panel Kontrolü

1. Admin panele gidin: http://localhost:5173/blu4ck
2. Şifre girin: `130113`
3. **"Dijital Analiz Talepleri"** sekmesine tıklayın
4. Az önce gönderdiğiniz talebi görüyor musunuz?

**Beklenen:** ✅ Talep listede görünüyor, status: **Pending**

### Test 3: Talebi Onayla

1. Talep satırında **"Onayla"** butonuna tıklayın
2. Status **"Approved"** olmalı

**Beklenen:** ✅ Status değişti, **"Analizi Başlat"** butonu göründü

### Test 4: PDF Oluşturma

1. **"Analizi Başlat"** butonuna tıklayın
2. Status **"Processing"** olmalı
3. Bekleyin (~30-60 saniye)
4. Status **"Completed"** olmalı
5. **"Raporu Görüntüle"** butonu görünmeli

**Beklenen:** ✅ PDF başarıyla oluşturuldu

### Test 5: PDF İndirme ve Görüntüleme

1. **"Raporu Görüntüle"** butonuna tıklayın
2. Yeni sekmede PDF açılmalı

**Kontrol Listesi:**
- [ ] PDF açıldı
- [ ] Header'da "Dijital Analiz Raporu" yazıyor
- [ ] Teknoloji Menajeri logosu/branding var
- [ ] Metrikler görünüyor (Performance, SEO, Social Media scores)
- [ ] AI önerileri var
- [ ] Footer'da iletişim bilgileri var

**Beklenen:** ✅ Profesyonel branded PDF rapor

---

## 8️⃣ LOG KONTROLÜ

### Gotenberg Logs
```bash
docker logs --tail 100 gotenberg-pdf-service
```

**Aranacak:** Hata mesajları var mı?

### Edge Function Logs
1. Supabase Dashboard açın
2. **Edge Functions** > **analyze-website** seçin
3. **Logs** tab'ine gidin
4. Son çalıştırma loglarını kontrol edin

**Başarılı akış görmelisiniz:**
```
🔍 Starting analysis for: https://example.com
✅ Performance analysis completed
✅ SEO analysis completed
✅ Social media analysis completed
✅ AI insights generated
✅ Markdown report generated
📝 Generating PDF report with Gotenberg...
📤 Sending HTML to Gotenberg at: http://host.docker.internal:3000
✅ PDF generated successfully, size: X bytes
✅ PDF uploaded to Supabase Storage
✅ Analysis completed and saved to database
✅ Report email sent to user
```

---

## 9️⃣ EMAIL TEST (Opsiyonel)

### Eğer Mailgun Configured:

1. Test email adresinizi kullanın
2. Analiz tamamlandıktan sonra email kontrolü yapın
3. Spam klasörünü de kontrol edin

**Beklenen:** Email geldi ve PDF linki çalışıyor

---

## 🔟 PERFORMANS TEST

### PDF Oluşturma Süresi
- **Basit site:** ~10-20 saniye
- **Orta karmaşıklık:** ~20-40 saniye
- **Karmaşık site:** ~40-60 saniye

### Eğer Çok Yavaşsa:
1. Google PageSpeed API yanıt süresi (~5-10s)
2. Website fetch süresi (~2-5s)
3. AI insights süresi (~3-5s)
4. PDF generation (~1-2s)

**Toplam normal süre:** 15-45 saniye

---

## ✅ BAŞARI KRİTERLERİ

Tüm bunlar başarılı olmalı:

- [x] Docker container çalışıyor
- [x] Gotenberg health check OK
- [x] Supabase secrets mevcut
- [x] Edge Functions deployed
- [x] Storage bucket oluşturuldu
- [x] Database tablosu mevcut
- [x] Frontend başladı
- [x] Form gönderimi başarılı
- [x] Admin panel çalışıyor
- [x] PDF oluşturma başarılı
- [x] PDF görüntüleme başarılı
- [x] Logs temiz (hatasız)

---

## 🐛 SORUN ÇÖZME

### Sorun: Gotenberg'e erişilemiyor
```bash
# Container durumunu kontrol et
docker ps -a | grep gotenberg

# Restart
docker-compose restart

# Logs
docker logs gotenberg-pdf-service
```

### Sorun: PDF oluşturulmuyor
1. Edge Function logs kontrol et
2. Gotenberg logs kontrol et
3. `GOTENBERG_URL` secret doğru mu?
4. Docker network erişimi var mı?

### Sorun: Storage upload hatası
1. Bucket var mı?
2. Public mu?
3. RLS policies doğru mu?
4. Service role key doğru mu?

### Sorun: Email gitmiyor
1. Mailgun domain doğrulandı mı?
2. Templates oluşturuldu mu?
3. API key doğru mu?

---

## 🎉 SİSTEM HAZIR!

Tüm testler başarılı olduğunda, sistem production'da kullanılmaya hazırdır!

### Sonraki Adımlar:
1. Production domain'e deploy
2. Monitoring ekle (Sentry/LogRocket)
3. Analytics ekle (Google Analytics)
4. Backup strategy belirle
5. Kullanıcı feedback topla

---

*Test Tarihi: 2025-10-22*
*Teknoloji Menajeri - PDF Rapor Sistemi*


