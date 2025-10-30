
-- Create table for tracking link clicks globally
CREATE TABLE public.click_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  link_id integer NOT NULL,
  result_name text NOT NULL,
  result_title text NOT NULL,
  click_count integer NOT NULL DEFAULT 1,
  last_clicked_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for tracking user sessions globally
CREATE TABLE public.session_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  page text NOT NULL,
  start_time timestamp with time zone NOT NULL DEFAULT now(),
  end_time timestamp with time zone,
  duration integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS (but make tables publicly accessible since we're tracking all visitors)
ALTER TABLE public.click_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read click analytics
CREATE POLICY "Anyone can view click analytics"
ON public.click_analytics
FOR SELECT
USING (true);

-- Allow anyone to insert click analytics
CREATE POLICY "Anyone can insert click analytics"
ON public.click_analytics
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their own session's click analytics
CREATE POLICY "Anyone can update click analytics"
ON public.click_analytics
FOR UPDATE
USING (true);

-- Allow anyone to read session analytics
CREATE POLICY "Anyone can view session analytics"
ON public.session_analytics
FOR SELECT
USING (true);

-- Allow anyone to insert session analytics
CREATE POLICY "Anyone can insert session analytics"
ON public.session_analytics
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update session analytics
CREATE POLICY "Anyone can update session analytics"
ON public.session_analytics
FOR UPDATE
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_click_analytics_session_id ON public.click_analytics(session_id);
CREATE INDEX idx_click_analytics_link_id ON public.click_analytics(link_id);
CREATE INDEX idx_session_analytics_session_id ON public.session_analytics(session_id);
