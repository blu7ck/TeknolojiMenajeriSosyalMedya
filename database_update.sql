-- Blog posts tablosuna category ve tags kolonları ekleme
-- Bu script'i Supabase SQL Editor'de çalıştırın

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

-- Mevcut blog post'ları için varsayılan değerler ekle
UPDATE public.blog_posts 
SET category = 'genel' 
WHERE category IS NULL;

-- RLS policy'lerini güncelle (yeni kolonlar için)
-- Bu kolonlar zaten mevcut policy'ler tarafından kapsanıyor
-- Ancak emin olmak için policy'leri kontrol edelim

-- Authenticated users can insert blog posts (category ve tags dahil)
CREATE POLICY IF NOT EXISTS "Authenticated users can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update blog posts (category ve tags dahil)
CREATE POLICY IF NOT EXISTS "Authenticated users can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anyone can select published blog posts
CREATE POLICY IF NOT EXISTS "Anyone can select published blog posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Authenticated users can select all blog posts
CREATE POLICY IF NOT EXISTS "Authenticated users can select all blog posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Success message
SELECT 'Database schema updated successfully! Category and tags columns added.' as message;
