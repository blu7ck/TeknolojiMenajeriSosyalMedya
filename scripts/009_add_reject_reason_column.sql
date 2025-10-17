-- Add reject_reason column to digital_analysis_requests table
ALTER TABLE digital_analysis_requests 
ADD COLUMN reject_reason TEXT,
ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN digital_analysis_requests.reject_reason IS 'Reason for rejection when status is rejected';
COMMENT ON COLUMN digital_analysis_requests.rejected_at IS 'Timestamp when request was rejected';
