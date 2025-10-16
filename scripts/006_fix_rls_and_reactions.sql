-- RLS Policy düzeltmeleri
-- Önce mevcut policy'leri kontrol edelim ve gerekirse yeniden oluşturalım

-- blog_posts için authenticated kullanıcı policy'lerini yeniden oluştur
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view all blog posts" ON public.blog_posts;

-- Yeni policy'ler
CREATE POLICY "Authenticated users can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated users tüm yazıları görebilmeli (draft dahil)
CREATE POLICY "Authenticated users can view all blog posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- blog_reactions için foreign key sorununu çözelim
-- Önce mevcut kısıtlamayı kontrol edelim
DO $$ 
BEGIN
  -- blog_reactions tablosundaki yanlış verileri temizle
  DELETE FROM public.blog_reactions 
  WHERE blog_post_id NOT IN (SELECT id FROM public.blog_posts);
END $$;

-- Foreign key constraint'i yeniden oluştur (eğer yoksa)
ALTER TABLE public.blog_reactions 
DROP CONSTRAINT IF EXISTS blog_reactions_blog_post_id_fkey;

ALTER TABLE public.blog_reactions 
ADD CONSTRAINT blog_reactions_blog_post_id_fkey 
FOREIGN KEY (blog_post_id) 
REFERENCES public.blog_posts(id) 
ON DELETE CASCADE;

