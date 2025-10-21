-- Drop existing table and related objects
DROP TABLE IF EXISTS package_requests CASCADE;
DROP FUNCTION IF EXISTS update_package_requests_updated_at() CASCADE;

-- Create package_requests table
CREATE TABLE package_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Customer Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_info TEXT,
  
  -- Package Information
  package_type TEXT NOT NULL, -- 'individual', 'influencer', 'corporate'
  package_title TEXT NOT NULL,
  selected_modules JSONB NOT NULL DEFAULT '[]',
  
  -- Social Media Accounts
  social_media_accounts JSONB NOT NULL DEFAULT '[]',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'accepted', 'rejected')),
  
  -- Admin Notes
  admin_notes TEXT,
  quoted_price DECIMAL(10,2),
  quoted_at TIMESTAMP WITH TIME ZONE,
  
  -- Contact Information
  contacted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_package_requests_status ON package_requests(status);
CREATE INDEX idx_package_requests_created_at ON package_requests(created_at DESC);
CREATE INDEX idx_package_requests_email ON package_requests(email);

-- Disable RLS for this table (public can insert, but we'll control access via application logic)
-- Note: Admin panel will still require authentication via Supabase Auth
ALTER TABLE package_requests DISABLE ROW LEVEL SECURITY;

-- Create function to automatically update updated_at
CREATE FUNCTION update_package_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_package_requests_updated_at
  BEFORE UPDATE ON package_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_package_requests_updated_at();

-- Insert sample data (optional)
-- INSERT INTO package_requests (
--   first_name, last_name, email, phone, package_type, package_title, selected_modules, social_media_accounts
-- ) VALUES (
--   'Test', 'User', 'test@example.com', '+905551234567', 'individual', 'Bireysel', 
--   '["Fenomen Paket", "Kişiye Özel İçerik Üretimi"]',
--   '[{"platform": "instagram", "username": "testuser"}, {"platform": "tiktok", "username": "testuser"}]'
-- );
