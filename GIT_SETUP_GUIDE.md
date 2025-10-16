# 🚀 Git Repository Kurulum Rehberi

## 📋 Adım Adım Git İşlemleri

### 1️⃣ Remote Repository Ekleme
```bash
# Mevcut repo'nuzun URL'ini ekleyin:
git remote add origin https://github.com/KULLANICIADI/REPO-ADI.git

# Veya SSH:
git remote add origin git@github.com:KULLANICIADI/REPO-ADI.git
```

### 2️⃣ Mevcut Repo'dan Veri Çekme
```bash
# Mevcut repo'daki dosyaları çekin
git fetch origin

# Hangi branch'ler var kontrol edin
git branch -r
```

### 3️⃣ Merge Stratejisi Seçme

#### **Seçenek A: Mevcut Kodu Tamamen Değiştir (Önerilen)**
```bash
# Mevcut main/master branch'ini alın
git checkout -b main origin/main

# Tüm dosyaları silin (mevcut kodları temizleyin)
git rm -r *
git rm -r .*

# Yeni projeyi ekleyin
git add .

# Commit yapın
git commit -m "feat: Blog eklendi, mail entegrasyonu kuruldu, backend supabase ile sağlandı - beta.v1"

# Push edin
git push origin main
```

#### **Seçenek B: Mevcut Kodu Koruyarak Merge**
```bash
# Mevcut main/master branch'ini alın
git checkout -b main origin/main

# Yeni değişiklikleri ekleyin
git add .

# Commit yapın
git commit -m "feat: Blog eklendi, mail entegrasyonu kuruldu, backend supabase ile sağlandı - beta.v1"

# Push edin (eğer conflict varsa çözün)
git push origin main
```

#### **Seçenek C: Yeni Branch Oluştur**
```bash
# Yeni bir beta branch oluşturun
git checkout -b beta-v1 origin/main

# Yeni projeyi ekleyin
git add .

# Commit yapın
git commit -m "feat: Blog eklendi, mail entegrasyonu kuruldu, backend supabase ile sağlandı - beta.v1"

# Yeni branch'i push edin
git push origin beta-v1
```

### 4️⃣ Tag Oluşturma (Opsiyonel)
```bash
# Beta v1 tag'i oluşturun
git tag -a beta.v1 -m "Beta Version 1.0 - Blog ve Mail Entegrasyonu"

# Tag'i push edin
git push origin beta.v1
```

## ⚠️ Önemli Notlar

### **Dosya Çakışmaları:**
- Eğer mevcut repo'da aynı isimde dosyalar varsa çakışma olabilir
- `.gitignore` dosyası mevcut repo'daki ile birleştirilmeli
- `package.json` gibi dosyalar dikkatli merge edilmeli

### **Environment Variables:**
- `.env` dosyası Git'e eklenmeyecek (zaten .gitignore'da)
- Supabase environment variables'ları dashboard'da ayarlanmalı

### **Database Migration:**
- Mevcut veritabanı varsa yedek alın
- Yeni schema'yı test ortamında deneyin
- SQL script'leri (`scripts/` klasörü) sırayla çalıştırın

## 🎯 Önerilen Yaklaşım

**Seçenek A'yı öneriyorum** çünkü:
- ✅ Temiz başlangıç
- ✅ Çakışma riski yok
- ✅ Yeni proje yapısı korunur
- ✅ Mevcut kodlar tamamen güncellenir

## 📞 Sonraki Adımlar

1. **Remote URL'ini ekleyin**
2. **Seçenek A'yı uygulayın**
3. **Environment variables'ları ayarlayın**
4. **Supabase'i yapılandırın**
5. **Test edin**
