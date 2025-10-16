# E-posta Entegrasyonu Kurulum Rehberi

Bu proje Mailgun ve Supabase Edge Functions kullanarak otomatik e-posta gönderimi yapmaktadır.

## Gereksinimler

1. **Mailgun Hesabı**
   - [Mailgun](https://www.mailgun.com/) üzerinden ücretsiz hesap oluşturun
   - Domain doğrulaması yapın (veya sandbox domain kullanın)
   - API Key'inizi alın

2. **Supabase Edge Functions**
   - Supabase CLI kurulu olmalı: `npm install -g supabase`
   - Supabase projenize bağlı olmalısınız

## Kurulum Adımları

### 1. Mailgun Yapılandırması

Mailgun dashboard'unuzdan:
- API Key'inizi kopyalayın
- Domain adresinizi not edin (örn: `mg.yourdomain.com`)

### 2. Supabase Environment Variables

Supabase dashboard'unuzda Settings > Edge Functions > Secrets bölümünden şu değişkenleri ekleyin:

\`\`\`
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
\`\`\`

### 3. Edge Functions Deploy

Terminal'de proje dizininde:

\`\`\`bash
# Supabase'e login olun
supabase login

# Projenize bağlanın
supabase link --project-ref your-project-ref

# Edge functions'ları deploy edin
supabase functions deploy send-welcome-email
supabase functions deploy send-new-post-notification
\`\`\`

### 4. Test Etme

Newsletter formunu kullanarak abone olun ve hoş geldiniz e-postasının geldiğini kontrol edin.

## E-posta Şablonları

### Hoş Geldiniz E-postası
- Yeni abone olunduğunda otomatik gönderilir
- Kişiselleştirilmiş hitap (X Bey / Y Hanım)
- Modern, mobil uyumlu tasarım

### Yeni Blog Yazısı Bildirimi
- Admin panelinden yeni yazı yayınlandığında manuel tetiklenir
- Tüm aktif abonelere gönderilir
- Blog yazısının başlığı, alt başlığı ve öne çıkan görseli içerir

## Kullanım

### Newsletter Aboneliği
\`\`\`typescript
import { sendWelcomeEmail } from './lib/email-service'

// Abone olduktan sonra
await sendWelcomeEmail(email, firstName, lastName, gender)
\`\`\`

### Yeni Yazı Bildirimi
\`\`\`typescript
import { sendNewPostNotification } from './lib/email-service'

// Blog yazısı yayınlandıktan sonra
await sendNewPostNotification(postId)
\`\`\`

## Sorun Giderme

- **E-posta gelmiyor**: Mailgun sandbox kullanıyorsanız, sadece authorized recipients'a e-posta gönderebilirsiniz
- **Edge function hatası**: Supabase logs'larını kontrol edin: `supabase functions logs send-welcome-email`
- **API Key hatası**: Environment variables'ların doğru ayarlandığından emin olun
