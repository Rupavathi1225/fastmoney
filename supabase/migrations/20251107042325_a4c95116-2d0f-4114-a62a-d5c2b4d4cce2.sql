-- Add new columns to session_analytics table
ALTER TABLE session_analytics 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS device TEXT,
ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 1;

-- Add new columns to click_analytics table to track search terms and blog clicks
ALTER TABLE click_analytics
ADD COLUMN IF NOT EXISTS search_term TEXT,
ADD COLUMN IF NOT EXISTS is_blog_click BOOLEAN DEFAULT false;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_session_analytics_session_id ON session_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_session_id ON click_analytics(session_id);