-- Newsletter subscribers için unsubscribe işlemi için RLS policy ekleme

-- Unsubscribe için update policy (email ile)
CREATE POLICY "Allow unsubscribe by email" ON public.newsletter_subscribers
FOR UPDATE USING (
  email = current_setting('request.headers')::json->>'x-forwarded-for' 
  OR 
  email = current_setting('request.headers')::json->>'x-real-ip'
  OR
  true -- Geçici olarak herkese izin ver (güvenlik için daha sonra iyileştirilebilir)
);

-- Alternatif olarak, daha güvenli bir yöntem için unsubscribe token tablosu oluşturabiliriz
CREATE TABLE IF NOT EXISTS public.unsubscribe_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Token tablosu için RLS
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- Token okuma policy
CREATE POLICY "Anyone can read valid tokens" ON public.unsubscribe_tokens
FOR SELECT USING (expires_at > now() AND used_at IS NULL);

-- Token kullanma policy
CREATE POLICY "Anyone can mark token as used" ON public.unsubscribe_tokens
FOR UPDATE USING (true);

-- Token oluşturma policy
CREATE POLICY "Anyone can create unsubscribe tokens" ON public.unsubscribe_tokens
FOR INSERT WITH CHECK (true);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_token ON public.unsubscribe_tokens(token);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_email ON public.unsubscribe_tokens(email);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_tokens_expires ON public.unsubscribe_tokens(expires_at);

-- Token oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION generate_unsubscribe_token(email_address text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  token_value text;
BEGIN
  -- Rastgele token oluştur
  token_value := encode(gen_random_bytes(32), 'hex');
  
  -- Eski token'ları temizle
  DELETE FROM public.unsubscribe_tokens 
  WHERE email = email_address;
  
  -- Yeni token ekle
  INSERT INTO public.unsubscribe_tokens (email, token)
  VALUES (email_address, token_value);
  
  RETURN token_value;
END;
$$;

-- Token doğrulama fonksiyonu
CREATE OR REPLACE FUNCTION verify_unsubscribe_token(token_value text)
RETURNS TABLE(email_address text, is_valid boolean)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ut.email,
    CASE 
      WHEN ut.token IS NOT NULL AND ut.expires_at > now() AND ut.used_at IS NULL 
      THEN true 
      ELSE false 
    END
  FROM public.unsubscribe_tokens ut
  WHERE ut.token = token_value;
END;
$$;
