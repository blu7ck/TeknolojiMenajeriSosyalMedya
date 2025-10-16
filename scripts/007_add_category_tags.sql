-- Blog posts tablosuna category ve tags kolonları ekleme

-- Category kolonu ekle
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Tags kolonu ekle (array olarak)
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Category için index oluştur
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Tags için GIN index oluştur (array search için)
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- Category değerleri için constraint (opsiyonel)
-- ALTER TABLE public.blog_posts 
-- ADD CONSTRAINT check_category 
-- CHECK (category IN ('yapay-zeka', 'blockchain', 'mobil', 'web', 'bulut', 'güvenlik', 'oyun', 'iot', 'ar-vr', 'sosyal-medya') OR category IS NULL);

-- RLS policy'lerini güncelle (category ve tags için)
-- Bu kolonlar zaten mevcut policy'ler tarafından kapsanıyor
