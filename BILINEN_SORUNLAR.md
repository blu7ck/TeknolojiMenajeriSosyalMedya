# Bilinen Sorunlar

## 🚨 **Aktif Sorunlar**

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

### 3. PDF Generation Sorunu ✅ **ÇÖZÜLDÜ**
**Problem:** Raporlar sadece Markdown formatında oluşturuluyordu, PDF oluşturma çalışmıyordu
**Çözüm:** 
- ✅ Gotenberg Docker servisi entegre edildi
- ✅ HTML'den PDF dönüşümü eklendi
- ✅ Profesyonel branded PDF raporları
- ✅ Supabase Storage'a otomatik yükleme
- ✅ Email ile PDF gönderimi

**Teknik Detaylar:**
- Gotenberg 8 Docker container (localhost:3000)
- Chromium-based PDF rendering
- A4 format, custom styling
- 1-2 saniyede PDF oluşturma
- Otomatik backup: Markdown + GitHub Gist

**Kurulum:**
```bash
docker-compose up -d
```

## 🔧 **Gelecek İyileştirmeler**

1. **Storage:** Alternative storage solution (şu an Supabase Storage kullanılıyor)
2. **AI Token Limit:** Daha akıllı prompt engineering
3. **Error Handling:** Daha iyi hata yönetimi
4. **PDF Templates:** Daha fazla rapor şablonu seçeneği
5. **Mobil Arayüz:** Responsive design iyileştirmeleri

---
*Son güncelleme: 2025-10-22*
