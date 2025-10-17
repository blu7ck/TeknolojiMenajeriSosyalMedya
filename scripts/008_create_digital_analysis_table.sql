-- Digital Analysis Requests Table
CREATE TABLE IF NOT EXISTS digital_analysis_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(500) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  recaptcha_token TEXT,
  analysis_data JSONB,
  report_data JSONB,
  feedback_sent_at TIMESTAMP WITH TIME ZONE,
  feedback_completed_at TIMESTAMP WITH TIME ZONE,
  feedback_data JSONB
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_digital_analysis_requests_status ON digital_analysis_requests(status);
CREATE INDEX IF NOT EXISTS idx_digital_analysis_requests_email ON digital_analysis_requests(email);
CREATE INDEX IF NOT EXISTS idx_digital_analysis_requests_created_at ON digital_analysis_requests(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE digital_analysis_requests ENABLE ROW LEVEL SECURITY;

-- Admin can see all requests
CREATE POLICY "Admin can view all digital analysis requests" ON digital_analysis_requests
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous users to insert requests
CREATE POLICY "Allow anonymous insert" ON digital_analysis_requests
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to view their own requests by email
CREATE POLICY "Users can view own requests" ON digital_analysis_requests
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_digital_analysis_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_digital_analysis_requests_updated_at
  BEFORE UPDATE ON digital_analysis_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_analysis_requests_updated_at();
