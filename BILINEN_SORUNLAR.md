# Bilinen Sorunlar

## 🚨 **Aktif Sorunlar**

### 1. Supabase Storage MIME Type Sorunu
**Problem:** Supabase Storage hiçbir MIME type desteklemiyor
- `text/html` ❌
- `text/markdown` ❌  
- `text/plain` ❌
- `application/pdf` ❌
- `application/octet-stream` ❌

**Geçici Çözüm:** Content type olmadan upload
**Kalıcı Çözüm:** Farklı storage servisi veya base64 encoding

### 2. Puppeteer Edge Functions Sorunu
**Problem:** Supabase Edge Functions'da Puppeteer çalışmıyor
**Hata:** `Deno.lstatSync is blocklisted`
**Geçici Çözüm:** GitHub Gist kullanımı
**Kalıcı Çözüm:** External PDF service

### 3. Gemini AI Token Limiti Sorunu
**Problem:** Gemini 2.5 Flash token limiti aşılıyor
**Hata:** "AI yanıtı token limiti nedeniyle kesildi"
**Neden:** 
- Gemini 2.5 Flash ücretsiz tier sınırları
- Günlük request limiti (15 request/gün)
- Rate limiting
- Model internal token limitleri

**Geçici Çözüm:** Fallback system (AI olmadan çalışsın)
**Kalıcı Çözüm:** Gemini Pro'ya geçiş veya farklı AI servisi

## ✅ **Çözülen Sorunlar**

### 1. Email URL'leri
- ✅ Base URL: `https://studio.teknolojimenajeri.com`
- ✅ Admin panel: `/blu4ck`
- ✅ Müşteri linkleri: Studio site

### 2. Markdown Rapor Sistemi
- ✅ GitHub Gist integration
- ✅ Basit markdown format
- ✅ Private Gist güvenliği

## 🔧 **Gelecek İyileştirmeler**

1. **PDF Generation:** External service entegrasyonu
2. **Storage:** Alternative storage solution
3. **AI Token Limit:** Daha akıllı prompt engineering
4. **Error Handling:** Daha iyi hata yönetimi

---
*Son güncelleme: 2025-10-21*
