-- Eksik tabloları oluştur ve RLS politikalarını ekle

-- Blog reactions tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS public.blog_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('inspired', 'idea', 'motivated')),
  ip_address text NOT NULL,
  user_identifier text NOT NULL, -- cookie or IP hash
  created_at timestamptz DEFAULT now(),
  UNIQUE(blog_post_id, user_identifier, reaction_type)
);

-- Blog post views tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS public.blog_post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_identifier text NOT NULL, -- cookie or IP hash
  ip_address text NOT NULL,
  viewed_at timestamptz DEFAULT now()
);

-- Index'leri oluştur
CREATE INDEX IF NOT EXISTS idx_blog_reactions_post_id ON public.blog_reactions(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_user ON public.blog_reactions(user_identifier);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_id ON public.blog_post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_user ON public.blog_post_views(user_identifier);

-- RLS'yi etkinleştir
ALTER TABLE public.blog_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;

-- Blog reactions için RLS politikaları
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.blog_reactions;
DROP POLICY IF EXISTS "Anyone can add reactions" ON public.blog_reactions;

CREATE POLICY "Anyone can view reactions"
ON public.blog_reactions FOR SELECT
USING (true);

CREATE POLICY "Anyone can add reactions"
ON public.blog_reactions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can remove reactions"
ON public.blog_reactions FOR DELETE
USING (true);

-- Blog post views için RLS politikaları
DROP POLICY IF EXISTS "Anyone can view post views" ON public.blog_post_views;
DROP POLICY IF EXISTS "Anyone can add post views" ON public.blog_post_views;

CREATE POLICY "Anyone can view post views"
ON public.blog_post_views FOR SELECT
USING (true);

CREATE POLICY "Anyone can add post views"
ON public.blog_post_views FOR INSERT
WITH CHECK (true);

-- Tabloların oluşturulduğunu kontrol et
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('blog_reactions', 'blog_post_views', 'newsletter_subscribers', 'blog_posts')
ORDER BY table_name, ordinal_position;
