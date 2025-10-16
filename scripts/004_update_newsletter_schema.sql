-- Newsletter subscribers tablosunu mevcut şemaya uygun hale getir

-- Önce mevcut tabloyu kontrol et ve eksik sütunları ekle
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS profession text;

-- Eğer first_name ve last_name null ise, email'den türet
UPDATE public.newsletter_subscribers 
SET 
  first_name = COALESCE(first_name, split_part(email, '@', 1)),
  last_name = COALESCE(last_name, '')
WHERE first_name IS NULL OR last_name IS NULL;

-- Şimdi NOT NULL constraint'leri ekle (eğer veri varsa)
-- Önce mevcut verileri kontrol et
DO $$
BEGIN
  -- Eğer hiç null first_name yoksa constraint ekle
  IF NOT EXISTS (
    SELECT 1 FROM public.newsletter_subscribers 
    WHERE first_name IS NULL
  ) THEN
    ALTER TABLE public.newsletter_subscribers 
    ALTER COLUMN first_name SET NOT NULL;
  END IF;
  
  -- Eğer hiç null last_name yoksa constraint ekle
  IF NOT EXISTS (
    SELECT 1 FROM public.newsletter_subscribers 
    WHERE last_name IS NULL
  ) THEN
    ALTER TABLE public.newsletter_subscribers 
    ALTER COLUMN last_name SET NOT NULL;
  END IF;
END $$;

-- Index'leri güncelle
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at);

-- Tablo yapısını kontrol et
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'newsletter_subscribers' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
