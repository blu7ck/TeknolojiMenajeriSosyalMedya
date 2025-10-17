# reCAPTCHA Kurulum Rehberi

## 🚀 Production için reCAPTCHA Ayarları

### 1. Google reCAPTCHA Console'a Giriş
- [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin) adresine gidin
- Google hesabınızla giriş yapın

### 2. Yeni Site Oluşturma
1. **"+"** butonuna tıklayın
2. **Label**: "Teknoloji Menajeri Studio"
3. **reCAPTCHA type**: "reCAPTCHA v3" seçin
4. **Domains**: 
   - `studio.teknolojimenajeri.com`
   - `teknolojimenajeri.com` (ana domain)
   - `www.teknolojimenajeri.com`
   - `localhost` (development için)
5. **Accept the Terms of Service** işaretleyin
6. **Submit** butonuna tıklayın

### 3. Site Keys Alma
- **Site Key**: Frontend'de kullanılacak (public)
- **Secret Key**: Backend'de kullanılacak (private)

### 4. Environment Variables Ayarlama

#### Frontend (.env dosyası):
```bash
VITE_RECAPTCHA_SITE_KEY=your_new_site_key_here
```

#### Backend (Supabase Secrets):
```bash
supabase secrets set RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 5. Domain Ayarları
Production domain'inizi reCAPTCHA console'da kaydetmeyi unutmayın:
- `studio.teknolojimenajeri.com` (ana subdomain)
- `teknolojimenajeri.com` (ana domain)
- `www.teknolojimenajeri.com`

## 🧪 Development Mode
Development sırasında localhost için reCAPTCHA otomatik olarak atlanır ve test token'ı kullanılır.

## 🔧 Test Etme
1. Development: `http://localhost:5175` - reCAPTCHA atlanır
2. Production: `https://studio.teknolojimenajeri.com` - gerçek reCAPTCHA çalışır

## 📝 Notlar
- Site key'i public olarak paylaşabilirsiniz
- Secret key'i asla public yapmayın
- Domain'ler tam olarak eşleşmeli (www dahil)
- HTTPS gerekli (production için)
