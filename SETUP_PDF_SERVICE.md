# 📄 PDF Rapor Servisi Kurulum Rehberi

Bu dokümantasyon, Gotenberg ile PDF rapor oluşturma sisteminin kurulumunu ve kullanımını açıklar.

## 🎯 Genel Bakış

Teknoloji Menajeri platformu, dijital analiz raporlarını profesyonel PDF formatında oluşturmak için **Gotenberg** kullanır. Gotenberg, Docker tabanlı açık kaynaklı bir PDF generation servisidir.

### Sistem Akışı

```
1. Kullanıcı Dijital Analiz Formu Doldurur
   ↓
2. Request Veritabanına Kaydedilir
   ↓
3. Admin Analizi Başlatır
   ↓
4. Edge Function Website Analizi Yapar
   - Google PageSpeed Insights
   - SEO Analizi
   - Social Media Analizi
   - AI Insights (Gemini)
   ↓
5. HTML Rapor Oluşturulur
   ↓
6. Gotenberg HTML'i PDF'e Çevirir
   ↓
7. PDF Supabase Storage'a Yüklenir
   ↓
8. PDF Linki Email ile Müşteriye Gönderilir
```

---

## 🚀 Kurulum

### 1. Docker ve Docker Compose Kurulumu

**Windows:**
- Docker Desktop'ı indirin: https://www.docker.com/products/docker-desktop

**Mac:**
```bash
brew install --cask docker
```

**Linux:**
```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Gotenberg Servisini Başlatma

```bash
# Repository dizinine gidin
cd teknoloji-menajeri-sosyal-medya

# Docker Compose ile servisi başlatın
docker-compose up -d

# Servisi kontrol edin
docker ps | grep gotenberg
```

**Beklenen Çıktı:**
```
CONTAINER ID   IMAGE                    STATUS         PORTS
abc123def456   gotenberg/gotenberg:8    Up 2 minutes   127.0.0.1:3000->3000/tcp
```

### 3. Servis Health Check

```bash
# Health endpoint'i test edin
curl http://localhost:3000/health

# Beklenen yanıt:
# {"status":"up"}
```

---

## 🧪 Test

### Basit HTML'den PDF Testi

```bash
# Test HTML dosyası oluşturun
cat > test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; padding: 40px; }
        h1 { color: #DC2626; }
    </style>
</head>
<body>
    <h1>Test PDF Raporu</h1>
    <p>Bu bir test PDF'idir.</p>
</body>
</html>
EOF

# PDF oluşturun
curl \
  --request POST http://localhost:3000/forms/chromium/convert/html \
  --form files=@test.html \
  -o test.pdf

# PDF'i açın
open test.pdf  # Mac
xdg-open test.pdf  # Linux
start test.pdf  # Windows
```

### Supabase Edge Function Testi

Admin panelden dijital analiz başlatarak gerçek bir test yapabilirsiniz:

1. Admin paneline gidin: `/blu4ck`
2. "Dijital Analiz Talepleri" sekmesine tıklayın
3. Bekleyen bir talebi onaylayın
4. "Analizi Başlat" butonuna tıklayın
5. İşlem tamamlandığında PDF linkini kontrol edin

---

## 🔧 Konfigürasyon

### Docker Compose Ayarları

`docker-compose.yml` dosyasında özelleştirilebilir ayarlar:

```yaml
services:
  gotenberg:
    image: gotenberg/gotenberg:8
    ports:
      - "127.0.0.1:3000:3000"  # Sadece localhost'tan erişim
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Supabase Edge Function Environment Variables

Supabase Dashboard > Settings > Edge Functions > Add Secret:

```env
GOTENBERG_URL=http://host.docker.internal:3000
```

**Not:** 
- Local development: `http://localhost:3000`
- Supabase Cloud: `http://host.docker.internal:3000`
- Production (ayrı sunucu): `http://your-gotenberg-server:3000`

---

## 📊 Performans

### Benchmark Sonuçları

| Rapor Boyutu | İşlem Süresi | PDF Boyutu |
|--------------|--------------|------------|
| Basit (1 sayfa) | ~500ms | ~50KB |
| Orta (3 sayfa) | ~1s | ~150KB |
| Detaylı (5+ sayfa) | ~2s | ~300KB |

### Optimizasyon İpuçları

1. **Görselleri optimize edin**: Resimleri base64 yerine URL ile ekleyin
2. **Font yüklemeyi azaltın**: Web-safe fontlar kullanın
3. **CSS karmaşıklığını azaltın**: Basit stil kuralları kullanın
4. **waitDelay parametresi**: Gerekirse artırın (varsayılan: 1s)

---

## 🐛 Sorun Giderme

### Gotenberg Servisi Başlamıyor

```bash
# Container loglarını kontrol edin
docker logs gotenberg-pdf-service

# Servisi yeniden başlatın
docker-compose down
docker-compose up -d
```

### Port 3000 Zaten Kullanımda

```yaml
# docker-compose.yml dosyasını düzenleyin
ports:
  - "127.0.0.1:3001:3000"  # Port numarasını değiştirin

# Edge Function environment variable'ı güncelleyin
GOTENBERG_URL=http://host.docker.internal:3001
```

### PDF Oluşturulmuyor

**1. Gotenberg bağlantısını test edin:**
```bash
curl http://localhost:3000/health
```

**2. Edge Function loglarını kontrol edin:**
- Supabase Dashboard > Edge Functions > Logs
- "📤 Sending HTML to Gotenberg" mesajını arayın

**3. HTML içeriğini kontrol edin:**
- Edge Function loglarında "📝 HTML content length" mesajını kontrol edin
- HTML syntax hatalarını kontrol edin

### Supabase Storage Upload Hatası

```bash
# Storage bucket'ının oluşturulduğundan emin olun
# Supabase Dashboard > Storage > Create Bucket
# Bucket adı: digital-analysis-reports
# Public: Yes
```

---

## 🔐 Güvenlik

### Production Deployment

1. **Gotenberg'i private network'te çalıştırın**
```yaml
# docker-compose.yml
networks:
  internal:
    driver: bridge
```

2. **IP whitelist kullanın**
- Sadece Supabase IP'lerinden erişime izin verin
- Firewall kuralları ekleyin

3. **Rate limiting ekleyin**
- Nginx/Traefik ile rate limit
- Örnek: 10 request/minute/IP

4. **HTTPS kullanın**
- Let's Encrypt ile SSL sertifikası
- Reverse proxy (Nginx/Caddy)

---

## 📚 Referanslar

- **Gotenberg Dokümantasyonu**: https://gotenberg.dev
- **Docker Dokümantasyonu**: https://docs.docker.com
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions

---

## 💡 İpuçları

### PDF Kalitesi Artırma

```typescript
// Edge Function içinde Gotenberg parametreleri
formData.append('scale', '1.0')        // Zoom seviyesi (0.1-2.0)
formData.append('paperWidth', '8.27')  // A4 genişlik (inches)
formData.append('paperHeight', '11.7') // A4 yükseklik (inches)
formData.append('printBackground', 'true') // Arka plan renkleri
formData.append('preferCssPageSize', 'false')
```

### Özel Font Ekleme

HTML içinde Google Fonts kullanın:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Inter', sans-serif; }
</style>
```

### Sayfa Numaraları Ekleme

```html
<style>
  @page {
    @bottom-center {
      content: counter(page) " / " counter(pages);
    }
  }
</style>
```

---

## 📞 Destek

Sorunlarla karşılaşırsanız:
- **GitHub Issues**: Repository'de issue açın
- **Email**: gulsah@teknolojimenajeri.com
- **Dokümantasyon**: Bu dosyayı kontrol edin

---

*Son güncelleme: 2025-10-22*

