-- Add time spent tracking to click_analytics
ALTER TABLE click_analytics 
ADD COLUMN IF NOT EXISTS time_spent_seconds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_clicked_at timestamp with time zone DEFAULT now();