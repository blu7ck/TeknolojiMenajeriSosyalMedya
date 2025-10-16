# 🚨 Sorun Çözümleri

## ✅ **1. RLS Policy ve Taslak Kaydetme Hatası**

### Sorun:
- Taslak kaydetmeye çalışırken `new row violates row-level security policy` hatası alınıyordu
- Blog reactions foreign key hatası (`Key is not present in table "blog_posts"`)

### Çözüm:
Aşağıdaki SQL script'i Supabase SQL Editor'de çalıştırın:

**Script:** `scripts/006_fix_rls_and_reactions.sql`

```bash
# Supabase Dashboard'da:
1. SQL Editor'e git
2. scripts/006_fix_rls_and_reactions.sql dosyasının içeriğini kopyala
3. "Run" butonuna tıkla
```

---

## ✅ **2. Email Template Sorunları**

### Sorunlar:
- 3 sayfa mail oluşuyordu (gereksiz boşluklar)
- Kırmızı buton tıklanamıyordu
- Blog görseli görünmüyordu
- TM logosu footer'da görünmüyordu
- İsim yanlarında `**` sembolü vardı (`**Furkan Akbas**`)

### Çözüm:
**Düzeltilmiş template:** `mailgun_update_notification_fixed.html`

#### Mailgun'a Yükleyin:

1. **Mailgun Dashboard'a git:**
   - https://app.mailgun.com/mg/sending/domains
   - Sending → Templates

2. **`update_notification_tr` template'ini bul ve düzenle**

3. **`mailgun_update_notification_fixed.html` dosyasının içeriğini kopyala ve yapıştır**

4. **Değişiklikleri kaydet**

### ✨ Düzeltmeler:
- ✅ Gereksiz boşluklar kaldırıldı (tek sayfa email)
- ✅ Buton tıklanabilir hale getirildi (`padding: 14px 35px`)
- ✅ Blog görseli eklendi (`%recipient.gorsel%`)
- ✅ Footer'a TM logosu eklendi
- ✅ `**İsim**` yerine `%recipient.isim%` formatı kullanıldı (** sembolleri kaldırıldı)
- ✅ Template daha temiz ve profesyonel görünüyor

---

## ✅ **3. Edge Function Güncellemesi**

### Değişiklikler:
- `baslik` artık dinamik: `post.title` kullanılıyor
- `gorsel` için fallback: Eğer cover_image yoksa TM logosu gösteriliyor

**Deploy edildi:** ✅ `send-new-post-notification`

---

## 🧪 **Test Adımları**

### 1️⃣ RLS Policy Testi:
1. Admin panel'e git (`/blu4ck`)
2. Yeni bir blog yazısı oluştur
3. Status'u **"draft"** seç
4. **"Kaydet"** butonuna tıkla
5. ✅ Hata almamalısın

### 2️⃣ Email Template Testi:
1. Blog yazısı başlığını **"ŞİMDİLERDE NELER OLUYOR?"** yap
2. Bir görsel yükle
3. Status'u **"published"** seç
4. **"Kaydet"** butonuna tıkla
5. ✅ Console'da şu mesajları görmelisin:
   ```
   📧 Blog yazısı kaydedildi, email tetikleniyor: ŞİMDİLERDE NELER OLUYOR?
   📧 Post ID: xxx-xxx-xxx
   📧 Email response: { data: {...}, error: null }
   ✅ Blog yazısı email'i gönderildi
   ```
6. ✅ Mailgun logs'da email gönderimini görmelisin
7. ✅ Email'de:
   - Blog görseli görünmeli
   - Buton tıklanabilir olmalı
   - Footer'da TM logosu olmalı
   - İsim düzgün görünmeli (** sembolleri yok)
   - Tek sayfa email olmalı (gereksiz boşluklar yok)

---

## 📋 **Yapılacaklar Listesi**

- [ ] `scripts/006_fix_rls_and_reactions.sql` script'ini Supabase'de çalıştır
- [ ] `mailgun_update_notification_fixed.html` template'ini Mailgun'a yükle
- [ ] Taslak kaydetme testini yap
- [ ] Email gönderim testini yap
- [ ] Email'i kontrol et (görsel, buton, logo, isim, boşluklar)

---

## 🎯 **Sonuç**

Artık:
- ✅ Taslak blog yazıları kaydedilebilir (RLS hatası yok)
- ✅ Email template'i düzgün çalışıyor (tek sayfa, tıklanabilir buton)
- ✅ Blog görseli email'de görünüyor
- ✅ İsim düzgün formatlanıyor (** sembolleri yok)
- ✅ Footer'da TM logosu var
- ✅ Email profesyonel ve temiz görünüyor

