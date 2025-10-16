# Supabase Kurulum Rehberi

Bu proje için Supabase veritabanını kurmanız ve yapılandırmanız gerekiyor.

## 🚀 Adım 1: Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın
4. "New Project" butonuna tıklayın
5. Aşağıdaki bilgileri girin:
   - **Name:** teknoloji-menajeri-blog
   - **Database Password:** Güçlü bir şifre oluşturun (kaydedin!)
   - **Region:** En yakın bölgeyi seçin (örn: Europe West)
6. "Create new project" butonuna tıklayın
7. Projenin oluşturulmasını bekleyin (~2 dakika)

## 🔑 Adım 2: API Anahtarlarını Alma

1. Supabase dashboard'da sol menüden **Settings** (⚙️) seçin
2. **API** sekmesine tıklayın
3. Şu bilgileri kopyalayın:
   - **Project URL** (URL)
   - **anon public** (API Key)

## 📝 Adım 3: Environment Dosyası Oluşturma

Proje kök dizininde `.env` dosyası oluşturun:

```bash
# Windows PowerShell
New-Item -Path .env -ItemType File

# veya manuel olarak .env dosyası oluşturun
```

`.env` dosyasının içeriği:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Önemli:** `xxxxxxxxxxxxx` kısımlarını kendi değerlerinizle değiştirin!

## 🗄️ Adım 4: Veritabanı Tablolarını Oluşturma

1. Supabase dashboard'da sol menüden **SQL Editor** seçin
2. "New Query" butonuna tıklayın
3. Aşağıdaki SQL kodunu yapıştırın:

```sql
-- Blog posts tablosu
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_name TEXT DEFAULT 'Admin',
  author_avatar TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog post görüntüleme istatistikleri
CREATE TABLE blog_post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter aboneleri
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- İndeksler (performans için)
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_post_views_post_id ON blog_post_views(post_id);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- RLS (Row Level Security) Politikaları
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Herkes published blog yazılarını okuyabilir
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Sadece authenticated kullanıcılar blog yazısı oluşturabilir
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Sadece authenticated kullanıcılar blog yazısı güncelleyebilir
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Sadece authenticated kullanıcılar blog yazısı silebilir
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Herkes view ekleyebilir
CREATE POLICY "Anyone can insert views"
  ON blog_post_views FOR INSERT
  WITH CHECK (true);

-- Herkes newsletter'a abone olabilir
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar aboneleri görebilir
CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. "Run" butonuna tıklayın
5. Başarılı mesajı görmelisiniz

## 👤 Adım 5: Admin Kullanıcısı Oluşturma

1. Supabase dashboard'da sol menüden **Authentication** seçin
2. **Users** sekmesine tıklayın
3. "Add user" butonuna tıklayın
4. "Create new user" seçin
5. Email ve şifre girin (örn: admin@teknolojimensajeri.com)
6. "Create user" butonuna tıklayın

## 🔄 Adım 6: Geliştirme Sunucusunu Yeniden Başlatma

`.env` dosyasını oluşturduktan sonra dev sunucusunu yeniden başlatın:

```bash
# Ctrl+C ile durdurun
# Sonra tekrar başlatın:
npm run dev
```

## ✅ Test Etme

1. Tarayıcıda `http://localhost:5173/blu4ck` adresine gidin
2. Şifreyi girin: `130113`
3. Admin email ve şifrenizi girin
4. Admin paneline erişebilmeniz gerekir!

## 🎨 Bonus: Storage Bucket (Görsel Yükleme İçin)

Eğer blog yazılarında görsel yüklemek isterseniz:

1. Supabase dashboard'da **Storage** sekmesine gidin
2. "New bucket" butonuna tıklayın
3. Bucket adı: `blog-images`
4. Public bucket olarak işaretleyin
5. "Create bucket" butonuna tıklayın

## 📚 Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Supabase Database](https://supabase.com/docs/guides/database)

## ⚠️ Güvenlik Notları

- `.env` dosyasını asla Git'e commit etmeyin
- Production için farklı API anahtarları kullanın
- RLS politikalarını ihtiyacınıza göre özelleştirin
- Database şifrenizi güvenli bir yerde saklayın

## 🐛 Sorun Giderme

**Hata: "Invalid API key"**
- `.env` dosyasındaki anahtarların doğru olduğundan emin olun
- Dev sunucusunu yeniden başlatın

**Hata: "Table does not exist"**
- SQL script'ini tekrar çalıştırın
- Tablo isimlerinin doğru olduğundan emin olun

**Hata: "Row Level Security policy violation"**
- RLS politikalarını kontrol edin
- Admin kullanıcısının authenticated olduğundan emin olun

**Blog görselleri görünmüyor:**
- Storage bucket'ının public olduğundan emin olun
- RLS politikalarını kontrol edin
- Görsel URL'lerinin doğru olduğundan emin olun

**Email template'leri Mailgun template'lerine dönüştürüldü:**
- `update_notification_tr` - Yeni blog yazısı bildirimi
- `welcome_corporate_tr` - Hoş geldin email'i
- Sadece isim bilgileri dinamik olarak gönderiliyor
- Template içeriği Mailgun üzerinden yönetiliyor

### 🖼️ Storage RLS Politikaları (Blog Görselleri)

Blog görselleri için gerekli RLS politikalarını ekleyin:

```sql
-- Blog görselleri için public okuma politikası
CREATE POLICY "Blog images are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Blog görselleri için yazma politikası (sadece authenticated kullanıcılar)
CREATE POLICY "Blog images can be uploaded by authenticated users" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Blog görselleri için güncelleme politikası
CREATE POLICY "Blog images can be updated by authenticated users" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Blog görselleri için silme politikası
CREATE POLICY "Blog images can be deleted by authenticated users" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
```

### 📧 Mailgun Template Kurulumu

Mailgun dashboard'da aşağıdaki template'leri oluşturun:

#### **1. update_notification_tr Template**

Template adı: `update_notification_tr`
Konu: `ŞİMDİLERDE NELER OLUYOR? | {{ay}} ÖZETİ`

Template içeriği:
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<title>ŞİMDİLERDE NELER OLUYOR? - Bu Ayın Teknoloji Özeti</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
<meta name="format-detection" content="telephone=no"/>
<link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet" />
<style type="text/css">
  @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
</style>
<style type="text/css">
body {
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100% !important;
  -ms-text-size-adjust: 100% !important;
  -webkit-font-smoothing: antialiased !important;
}
img {
  border: 0 !important;
  outline: none !important;
}
p {
  Margin: 0px !important;
  Padding: 0px !important;
}
table {
  border-collapse: collapse;
  mso-table-lspace: 0px;
  mso-table-rspace: 0px;
}
td, a, span {
  border-collapse: collapse;
  mso-line-height-rule: exactly;
}
.em_main_table { background-color:#ffffff !important; } 
.em_font_alata { font-family: 'Alata', Arial, sans-serif !important; }
.em_red { color: #e74c3c !important; } 
.em_black { color: #1a1a1a !important; }

.em_button {
    background-color: #e74c3c;
    border-radius: 5px;
}
.em_button a {
    font-family: 'Alata', Arial, sans-serif;
    color: #ffffff !important;
    font-weight: bold;
    text-decoration: none;
    display: block;
    padding: 12px 30px;
    font-size: 18px;
}
.em_aside25 { padding: 0 25px !important; }
.em_aside10 { padding: 0 10px !important; }
</style>
</head>
<body class="em_body" style="margin:0px auto; padding:0px;" bgcolor="#f0f0f0">

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#f0f0f0">
    <tr>
      <td align="center" valign="top">
          <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed; background-color:#ffffff;">
              <tr>
                  <td align="center" valign="top" style="padding:0 25px;" class="em_aside25">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                          <tr>
                              <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td align="center" valign="top">
                                  <a href="https://teknolojimenajeri.com" target="_blank" style="text-decoration:none;">
                                      <img src="https://i.ibb.co/CstJSnMp/logo.png" width="120" height="auto" alt="Teknoloji Menajeri Logo" border="0" style="display:block; font-family: 'Alata', Arial, sans-serif; font-size:20px; line-height:25px; text-align:center; color:#1a1a1a; font-weight:bold; max-width:120px;" />
                                  </a>
                              </td>
                          </tr>
                          <tr>
                              <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td height="1" bgcolor="#e74c3c" style="font-size:0px; line-height:0px; height:1px;"><img src="https://teknolojimenajeri.com/assets/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
                          </tr>
                           <tr>
                              <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </td>
    </tr>
</table>

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#f0f0f0">
    <tr>
        <td align="center" valign="top">
            <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed; background-color:#ffffff;">
                <tr>
                    <td align="center" valign="top" style="padding:0 25px; background-color:#ffffff;" bgcolor="#ffffff" class="em_aside25">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                           
                                <tr>
                                    <td class="em_red em_font_alata" align="center" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 24px; line-height: 29px; color:#e74c3c; font-weight:bold; padding-top:10px;">ŞİMDİLERDE NELER OLUYOR?</td>
                                </tr>
                            <tr>
                                <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>
                           
                                <tr>
                                    <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                        Merhaba %recipient.isim%,
                                    </td>
                                </tr>
                                <tr>
                                    <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                        Bu ayın teknoloji dünyasından önemli gelişmeler:
                                    </td>
                                </tr>
                              
                                <tr>
                                    <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 18px; line-height: 24px; color:#1a1a1a; font-weight:bold; margin-top:15px; padding: 15px 5px 10px;">
                                        Bu Ayın Özeti
                                    </td>
                                </tr>
                              
                                <tr>
                                    <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; font-style: italic; border-left: 3px solid #e74c3c; padding: 10px 5px 10px 15px;">
                                        %recipient.ozet%
                                    </td>
                                </tr>

                                <tr>
                                    <td height="15" style="height:15px; font-size:0px; line-height:0px;">&nbsp;</td>
                                </tr>

                                <tr>
                                    <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 14px; line-height: 22px; color:#1a1a1a; padding: 10px 5px;">
                                        %recipient.icerik%
                                    </td>
                                </tr>

                            <tr>
                                <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>

                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellspacing="0" cellpadding="0" align="center" class="em_button">
                                        <tr>
                                                <td height="48" align="center" valign="middle" style="height:48px;">
                                                    <a href="%recipient.link%" target="_blank" style="text-decoration:none; color:#ffffff; line-height:48px; display:block; font-size:18px;">
                                                        Tüm İçerikleri Oku
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                            </tr>
                           
                            <tr>
                                <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#f0f0f0">
    <tr>
        <td align="center" valign="top">
            <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
                <tr>
                    <td align="center" valign="top" style="padding:0 25px;" class="em_aside25">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                            <tr>
                                <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>
                           
                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellspacing="0" cellpadding="0" align="center">
                                        <tr>
                                             <td width="30" style="width:30px;" align="center" valign="middle">
                                                <a href="https://www.instagram.com/teknolojimenajeri/" target="_blank" style="text-decoration:none;">
                                                    <img src="https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/CIS-A2K_Instagram_Icon_(Black).svg.png" width="30" height="30" alt="Instagram" border="0" style="display:block; max-width:30px;" />
                                                </a>
                                            </td>
                            <td width="12" style="width:12px;">&nbsp;</td>
                            
                             <td width="30" style="width:30px;" align="center" valign="middle">
                                                <a href="https://linkedin.com/in/gulsahakin" target="_blank" style="text-decoration:none;">
                                                    <img src="https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/linkedin.png" width="30" height="30" alt="LinkedIn" border="0" style="display:block; max-width:30px;" />
                                                </a>
                                            </td>
                            </tr>
                        </table>
                    </td>
                </tr>
               
                <tr>
                    <td height="20" style="height:20px; font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
               
                <tr>
                    <td class="em_black" align="center" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;">
                        <a href="mailto:gulsah@teknolojimenajeri.com" style="text-decoration:none; color:#1a1a1a;">gulsah@teknolojimenajeri.com</a> 
                    </td>
                </tr>
               
                <tr>
                    <td height="20" style="height:20px; font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
               
                <tr>
                    <td class="em_grey" align="center" valign="middle" style="font-family: 'Alata', Arial, sans-serif; font-size: 11px; line-height: 16px; color:#434343;">
                        &copy; 2025 Teknoloji Menajeri. Tüm hakları saklıdır. &nbsp;|&nbsp;
<a href="%unsubscribe_url%" target="_blank" style="text-decoration:underline; color:#e74c3c;">Abonelikten Ayrıl</a>
                    </td>
                </tr>
               
                <tr>
                    <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
```

#### **2. welcome_corporate_tr Template**

Template adı: `welcome_corporate_tr`
Konu: `Teknoloji Menajeri Blog'a Hoş Geldiniz!`

Template içeriği:
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<title>Teknoloji Menajeri Blog'a Hoş Geldiniz!</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
<meta name="format-detection" content="telephone=no"/>
<link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet" />
<style type="text/css">
  @import url('https://fonts.googleapis.com/css2?family=Alata&display=swap');
</style>
<style type="text/css">
body {
  margin: 0;
  padding: 0;
  -webkit-text-size-adjust: 100% !important;
  -ms-text-size-adjust: 100% !important;
  -webkit-font-smoothing: antialiased !important;
}
img {
  border: 0 !important;
  outline: none !important;
}
p {
  Margin: 0px !important;
  Padding: 0px !important;
}
table {
  border-collapse: collapse;
  mso-table-lspace: 0px;
  mso-table-rspace: 0px;
}
td, a, span {
  border-collapse: collapse;
  mso-line-height-rule: exactly;
}
.em_main_table { background-color:#ffffff !important; } 
.em_font_alata { font-family: 'Alata', Arial, sans-serif !important; }
.em_red { color: #e74c3c !important; } 
.em_black { color: #1a1a1a !important; }

.em_button {
    background-color: #e74c3c;
    border-radius: 5px;
}
.em_button a {
    font-family: 'Alata', Arial, sans-serif;
    color: #ffffff !important;
    font-weight: bold;
    text-decoration: none;
    display: block;
    padding: 12px 30px;
    font-size: 18px;
}
.em_aside25 { padding: 0 25px !important; }
.em_aside10 { padding: 0 10px !important; }
</style>
</head>
<body class="em_body" style="margin:0px auto; padding:0px;" bgcolor="#f0f0f0">

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#f0f0f0">
    <tr>
      <td align="center" valign="top">
          <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed; background-color:#ffffff;">
              <tr>
                  <td align="center" valign="top" style="padding:0 25px;" class="em_aside25">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                          <tr>
                              <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td align="center" valign="top">
                                  <a href="https://teknolojimenajeri.com" target="_blank" style="text-decoration:none;">
                                      <img src="https://i.ibb.co/CstJSnMp/logo.png" width="120" height="auto" alt="Teknoloji Menajeri Logo" border="0" style="display:block; font-family: 'Alata', Arial, sans-serif; font-size:20px; line-height:25px; text-align:center; color:#1a1a1a; font-weight:bold; max-width:120px;" />
                                  </a>
                              </td>
                          </tr>
                          <tr>
                              <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td height="1" bgcolor="#e74c3c" style="font-size:0px; line-height:0px; height:1px;"><img src="https://teknolojimenajeri.com/assets/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;" /></td>
                          </tr>
                           <tr>
                              <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </td>
    </tr>
</table>

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#f0f0f0">
    <tr>
        <td align="center" valign="top">
            <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed; background-color:#ffffff;">
                <tr>
                    <td align="center" valign="top" style="padding:0 25px; background-color:#ffffff;" bgcolor="#ffffff" class="em_aside25">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                           
                            <tr>
                                <td class="em_red em_font_alata" align="center" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 24px; line-height: 29px; color:#e74c3c; font-weight:bold; padding-top:10px;">Hoş Geldiniz!</td>
                            </tr>
                            <tr>
                                <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>
                           
                            <tr>
                                <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                    Merhaba **%recipient.isim%**,
                                </td>
                            </tr>
                            <tr>
                                <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                    Teknoloji Menajeri blog newsletter'ına hoş geldiniz! Abone olduğunuz için teşekkür ederiz.
                                </td>
                            </tr>
                           
                            <tr>
                                <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                    Bundan sonra yeni blog yazılarımız yayınlandığında size özel bildirimler göndereceğiz. Dijital dünyada başarıya giden yolculuğunuzda size ilham verecek içerikler üretmeye devam edeceğiz.
                                </td>
                            </tr>

                            <tr>
                                <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>

                            <tr>
                                <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; font-style: italic; border-left: 3px solid #e74c3c; padding: 10px 5px 10px 15px;">
                                    <strong>İpucu:</strong> E-postalarımızı kaçırmamak için noreply@teknolojimenajeri.com adresini güvenli gönderenler listenize ekleyin.
                                </td>
                            </tr>

                            <tr>
                                <td height="20" style="height:20px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>

                            <tr>
                                <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                    Keyifli okumalar dileriz!
                                </td>
                            </tr>
                           
                            <tr>
                                <td class="em_black em_font_alata" align="left" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 16px; line-height: 24px; color:#1a1a1a; padding: 0 5px;">
                                    <strong>Teknoloji Menajeri Ekibi</strong>
                                </td>
                            </tr>
                           
                            <tr>
                                <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#f0f0f0">
    <tr>
        <td align="center" valign="top">
            <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
                <tr>
                    <td align="center" valign="top" style="padding:0 25px;" class="em_aside25">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                            <tr>
                                <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                            </tr>
                           
                            <tr>
                                <td align="center" valign="top">
                                    <table border="0" cellspacing="0" cellpadding="0" align="center">
                                        <tr>
                                             <td width="30" style="width:30px;" align="center" valign="middle">
                                                <a href="https://www.instagram.com/teknolojimenajeri/" target="_blank" style="text-decoration:none;">
                                                    <img src="https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/CIS-A2K_Instagram_Icon_(Black).svg.png" width="30" height="30" alt="Instagram" border="0" style="display:block; max-width:30px;" />
                                                </a>
                                            </td>
                            <td width="12" style="width:12px;">&nbsp;</td>
                            
                             <td width="30" style="width:30px;" align="center" valign="middle">
                                                <a href="https://linkedin.com/in/gulsahakin" target="_blank" style="text-decoration:none;">
                                                    <img src="https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/assests/linkedin.png" width="30" height="30" alt="LinkedIn" border="0" style="display:block; max-width:30px;" />
                                                </a>
                                            </td>
                            </tr>
                        </table>
                    </td>
                </tr>
               
                <tr>
                    <td height="20" style="height:20px; font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
               
                <tr>
                    <td class="em_black" align="center" valign="top" style="font-family: 'Alata', Arial, sans-serif; font-size: 13px; line-height: 15px; color:#434343;">
                        <a href="mailto:gulsah@teknolojimenajeri.com" style="text-decoration:none; color:#1a1a1a;">gulsah@teknolojimenajeri.com</a> 
                    </td>
                </tr>
               
                <tr>
                    <td height="20" style="height:20px; font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
               
                <tr>
                    <td class="em_grey" align="center" valign="middle" style="font-family: 'Alata', Arial, sans-serif; font-size: 11px; line-height: 16px; color:#434343;">
                        &copy; 2025 Teknoloji Menajeri. Tüm hakları saklıdır. &nbsp;|&nbsp;
<a href="%unsubscribe_url%" target="_blank" style="text-decoration:underline; color:#e74c3c;">Abonelikten Ayrıl</a>
                    </td>
                </tr>
               
                <tr>
                    <td height="30" style="height:30px; font-size:0px; line-height:0px;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
```

### 📋 Template Variables

#### **update_notification_tr için:**
- `isim` - Abone adı (örn: "Ahmet Yılmaz")
- `baslik` - Blog yazısı başlığı
- `ozet` - Blog yazısı özeti
- `link` - Blog yazısı URL'i

#### **welcome_corporate_tr için:**
- `isim` - Abone adı (örn: "Ahmet Bey", "Ayşe Hanım")

### 🔧 Newsletter RLS Policy Düzeltme

Eğer newsletter abonelik formunda HTTP 400 hatası alıyorsanız, RLS policy'lerini düzeltmeniz gerekir:

```sql
-- Supabase SQL Editor'da çalıştırın
\i scripts/003_fix_newsletter_rls.sql
```

Bu script:
- Anonymous kullanıcıların newsletter'a abone olmasına izin verir
- Unsubscribe işlemlerine izin verir
- Admin kullanıcıların tüm aboneleri yönetmesine izin verir

### 🔧 Newsletter Database Şema Güncelleme

Eğer "Could not find the 'first_name' column" hatası alıyorsanız, database şemasını güncellemeniz gerekir:

```sql
-- Supabase SQL Editor'da çalıştırın
\i scripts/004_update_newsletter_schema.sql
```

Bu script:
- Eksik sütunları (`first_name`, `last_name`, `profession`) ekler
- Mevcut verileri korur
- Email'den isim türetir
- Index'leri günceller

**Alternatif:** Basit email-only form kullanmak için `NewsletterFormSimple` kullanılabilir.

### 🔧 Eksik Tabloları Oluşturma

Eğer reaction butonları çalışmıyor ve 404 hatası alıyorsanız, eksik tabloları oluşturmanız gerekir:

```sql
-- Supabase SQL Editor'da çalıştırın
\i scripts/005_create_missing_tables.sql
```

Bu script:
- `blog_reactions` tablosunu oluşturur
- `blog_post_views` tablosunu oluşturur
- Gerekli index'leri ekler
- RLS politikalarını ayarlar
- Tablo yapısını kontrol eder

### 🚀 Edge Functions Deploy Etme

Newsletter email gönderimi için Edge Functions'ları deploy etmeniz gerekir:

```bash
# Supabase CLI ile Edge Functions deploy
supabase functions deploy send-welcome-email
supabase functions deploy send-new-post-notification
```

**Alternatif:** Supabase Dashboard'dan:
1. **Edge Functions** sekmesine gidin
2. **Deploy** butonuna tıklayın
3. `send-welcome-email` ve `send-new-post-notification` fonksiyonlarını deploy edin

### 🔐 Environment Variables Güncelleme

**Mailgun bilgilerini güncelledikten sonra:**
1. **Supabase Dashboard** → **Settings** → **Edge Functions**
2. **Environment Variables** sekmesine gidin
3. Aşağıdaki değişkenleri güncelleyin:

```bash
MAILGUN_API_KEY=your_new_api_key_here
MAILGUN_DOMAIN=your_new_domain_here
```

**Güvenlik Notları:**
- ✅ API key ve domain bilgileri güvenli şekilde saklanır
- ✅ Edge Functions environment variables ile korunur
- ✅ Kod içinde hardcode edilmez
- ✅ Email gönderimi sadece gerekli durumlarda çalışır

**CORS Hatası Alıyorsanız:**
- Edge Functions deploy edilmemiş olabilir
- Environment variables eksik olabilir
- Newsletter abonelik çalışır ama email gönderilmez (sorun değil)

### 🔍 Email Debug ve Sorun Giderme

**Email gönderilmiyor mu? Debug adımları:**

1. **Edge Function Log'larını Kontrol Edin:**
```bash
supabase functions logs send-welcome-email --follow
```

2. **Mailgun Template Kontrolü:**
- Mailgun dashboard'da `welcome_corporate_tr` template'i var mı?
- Template aktif mi?

3. **Environment Variables Kontrolü:**
- `MAILGUN_API_KEY` doğru mu?
- `MAILGUN_DOMAIN` doğru mu?
- Domain Mailgun'da aktif mi?

4. **Mailgun Domain Ayarları:**
- Domain DNS kayıtları doğru mu?
- Domain Mailgun'da verified mi?
- SMTP credentials doğru mu?

5. **Test Email Gönderimi:**
```bash
# Mailgun API test
curl -s --user 'api:YOUR_API_KEY' \
    https://api.mailgun.net/v3/YOUR_DOMAIN/messages \
    -F from='test@YOUR_DOMAIN' \
    -F to='test@example.com' \
    -F subject='Test' \
    -F text='Test message'
```

**Yaygın Sorunlar:**
- ❌ **Template bulunamıyor** - Mailgun'da template oluşturulmamış
- ❌ **Domain doğrulanmamış** - Mailgun'da domain verify edilmemiş
- ❌ **API key yanlış** - Mailgun API key'i hatalı
- ❌ **Spam klasörü** - Email spam klasörüne düşmüş olabilir

