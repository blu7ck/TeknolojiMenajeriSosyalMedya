-- Add admin update policy for digital_analysis_requests
CREATE POLICY "Admin can update digital analysis requests" ON digital_analysis_requests
  FOR UPDATE USING (auth.role() = 'service_role');

-- Allow service role to update any request
CREATE POLICY "Service role can update all requests" ON digital_analysis_requests
  FOR UPDATE USING (true);
