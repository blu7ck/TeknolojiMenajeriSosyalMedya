# Supabase Storage Kurulumu

Blog görselleri için Supabase Storage'ı yapılandırma rehberi.

## 🪣 Adım 1: Storage Bucket Oluşturma

1. Supabase Dashboard'a gidin
2. Sol menüden **Storage** sekmesine tıklayın
3. **"New bucket"** butonuna tıklayın
4. Formu doldurun:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ İşaretleyin (görseller herkese açık olacak)
   - **File size limit:** 50 MB (varsayılan)
   - **Allowed MIME types:** Leave empty (tüm görseller kabul edilir)
5. **"Create bucket"** butonuna tıklayın

## 🔓 Adım 2: Storage Policies (RLS)

Bucket oluşturduktan sonra izinleri ayarlayalım:

1. Oluşturulan `blog-images` bucket'ına tıklayın
2. **"Policies"** sekmesine geçin
3. Aşağıdaki policy'leri ekleyin:

### Policy 1: Herkes Okuyabilir (Public Read)

```sql
-- Herkes görselleri görebilir
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );
```

### Policy 2: Authenticated Kullanıcılar Upload Edebilir

```sql
-- Authenticated kullanıcılar görsel yükleyebilir
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Authenticated Kullanıcılar Güncelleyebilir

```sql
-- Authenticated kullanıcılar görselleri güncelleyebilir
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 4: Authenticated Kullanıcılar Silebilir

```sql
-- Authenticated kullanıcılar görselleri silebilir
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

## 📤 Adım 3: Görsel Yükleme

### Yöntem 1: Admin Panelden (Önerilen ✨)

Blog yazısı oluştururken direkt olarak:

1. Admin panele girin (`/blu4ck` → `130113`)
2. "Yeni Yazı" tab'ına tıklayın
3. "Kapak Görseli" bölümünde:
   - **"Görsel Yükle"** butonuna tıklayın
   - Bilgisayarınızdan görsel seçin
   - Otomatik olarak yüklenecek ve önizleme gösterilecek! 🎉

**Veya** URL alanına direkt link yapıştırabilirsiniz.

### Yöntem 2: Supabase Dashboard'dan

1. Supabase Dashboard'da **Storage** → **blog-images** bucket'ına gidin
2. **"Upload file"** butonuna tıklayın
3. Görselleri seçin ve yükleyin
4. Yüklenen görselin URL'sini kopyalayın:
   - Görsele sağ tıklayın
   - **"Copy URL"** seçin
   - Format: `https://xxxxx.supabase.co/storage/v1/object/public/blog-images/your-image.jpg`

## 🎨 Örnek Görsel URL'leri

Yüklediğiniz görsellerin URL formatı:

```
https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/blog-images/blog-cover-1.jpg
https://rqhrjhgcoonsvzjwlega.supabase.co/storage/v1/object/public/blog-images/blog-cover-2.jpg
```

## 🔮 Gelecek: Otomatik Upload (Opsiyonel)

İleride BlogEditor'a drag & drop özelliği eklenebilir:

```typescript
const handleImageUpload = async (file: File) => {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
```

## 📋 Görsel Yükleme Checklist

- [ ] Storage bucket oluşturuldu
- [ ] Public access açıldı
- [ ] RLS policies eklendi
- [ ] Test görseli yüklendi
- [ ] URL kopyalandı ve test edildi
- [ ] Blog yazısında görsel göründü

## 🐛 Sorun Giderme

**Görsel görünmüyor:**
- Public bucket olduğundan emin olun
- RLS policy'lerini kontrol edin
- URL'nin doğru olduğundan emin olun

**Upload edilemiyor:**
- Authenticated olduğunuzdan emin olun
- File size limit'i kontrol edin
- MIME type uyumlu mu kontrol edin

## 📚 Kaynaklar

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Security](https://supabase.com/docs/guides/storage/security/access-control)

