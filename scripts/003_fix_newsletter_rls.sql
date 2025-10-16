-- Newsletter subscribers RLS policy'lerini düzelt

-- Önce mevcut policy'leri sil
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON public.newsletter_subscribers;

-- Newsletter abonelik için herkese izin ver (anonymous dahil)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Newsletter abonelik için herkese izin ver (anonymous dahil) - UPDATE için
CREATE POLICY "Anyone can update their subscription" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (true);

-- Newsletter abonelik için herkese izin ver (anonymous dahil) - SELECT için
CREATE POLICY "Anyone can view subscription status" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (true);

-- Admin için ayrı policy (authenticated kullanıcılar için)
CREATE POLICY "Authenticated users can manage all subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
TO authenticated 
USING (true);
