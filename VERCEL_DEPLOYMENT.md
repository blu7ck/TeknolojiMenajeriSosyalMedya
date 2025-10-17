# Vercel Deployment Rehberi

## 🔧 Environment Variables Ayarlama

### 1. Vercel Dashboard'a Giriş
1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin
2. Projenizi seçin
3. **Settings** sekmesine tıklayın
4. **Environment Variables** bölümüne gidin

### 2. Gerekli Environment Variables

#### Frontend Variables (Vercel'de):
```bash
# reCAPTCHA Site Key (Public)
VITE_RECAPTCHA_SITE_KEY=6LcH1-OrAAAAAEIaj7WC1-0X3CAYS90f9TYC1t1Y

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Backend Variables (Supabase Secrets):
```bash
# Supabase CLI ile ayarlayın
supabase secrets set RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### 3. Vercel'de Environment Variables Ekleme

1. **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. **Add New** butonuna tıklayın
3. Her bir variable için:

#### VITE_RECAPTCHA_SITE_KEY:
- **Name**: `VITE_RECAPTCHA_SITE_KEY`
- **Value**: `6LcH1-OrAAAAAEIaj7WC1-0X3CAYS90f9TYC1t1Y`
- **Environment**: `Production`, `Preview`, `Development` (hepsini seçin)

#### VITE_SUPABASE_URL:
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://your-project.supabase.co`
- **Environment**: `Production`, `Preview`, `Development`

#### VITE_SUPABASE_ANON_KEY:
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `your_supabase_anon_key`
- **Environment**: `Production`, `Preview`, `Development`

### 4. Supabase Edge Function Deploy

```bash
# Supabase CLI ile Edge Function deploy et
supabase functions deploy verify-recaptcha

# Secret key'i ayarla
supabase secrets set RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### 5. Domain Ayarları

#### Google reCAPTCHA Console'da:
1. [reCAPTCHA Console](https://www.google.com/recaptcha/admin) adresine gidin
2. Site'inizi seçin
3. **Settings** → **Domains** bölümüne gidin
4. Production domain'inizi ekleyin:
   - `studio.teknolojimenajeri.com` (ana subdomain)
   - `teknolojimenajeri.com` (ana domain)
   - `www.teknolojimenajeri.com`
   - `your-vercel-domain.vercel.app` (geçici domain)

### 6. Vercel Custom Domain Ayarlama

#### Vercel Dashboard'da:
1. **Project Settings** → **Domains** bölümüne gidin
2. **Add Domain** butonuna tıklayın
3. **Domain** alanına `studio.teknolojimenajeri.com` yazın
4. **Add** butonuna tıklayın
5. DNS ayarlarını yapın (A record veya CNAME)

#### DNS Ayarları:
```
Type: CNAME
Name: studio
Value: cname.vercel-dns.com
```

### 7. Test Etme

#### Development:
```bash
npm run dev
# http://localhost:5175 - reCAPTCHA atlanır
```

#### Production:
```bash
# Vercel'e deploy et
vercel --prod

# Production URL'de test et
# https://studio.teknolojimenajeri.com
```

## 🚨 Önemli Notlar

1. **Secret Key**: Asla frontend'de kullanmayın, sadece backend'de
2. **Domain Kayıt**: reCAPTCHA console'da tüm domain'leri kaydedin
3. **HTTPS**: Production'da HTTPS gerekli
4. **Environment**: Her environment için ayrı ayrı ayarlayın

## 🔍 Troubleshooting

### reCAPTCHA "Invalid site key" hatası:
- Domain'in reCAPTCHA console'da kayıtlı olduğundan emin olun
- Site key'in doğru olduğunu kontrol edin

### Supabase Edge Function hatası:
- `supabase secrets list` ile secret'ları kontrol edin
- Edge Function'ın deploy edildiğinden emin olun
