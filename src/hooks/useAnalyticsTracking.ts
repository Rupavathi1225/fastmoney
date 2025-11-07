import { supabase } from "@/integrations/supabase/client";

// Generate a unique session ID for this browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('fastmoney_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('fastmoney_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
};

// Get source from URL parameters or referrer
const getSource = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get('utm_source');
  const ref = document.referrer;
  
  if (utm_source) return utm_source;
  if (!ref) return 'direct';
  
  try {
    const refUrl = new URL(ref);
    const hostname = refUrl.hostname;
    
    if (hostname.includes('google')) return 'google';
    if (hostname.includes('facebook')) return 'facebook';
    if (hostname.includes('twitter') || hostname.includes('t.co')) return 'twitter';
    if (hostname.includes('linkedin')) return 'linkedin';
    if (hostname.includes('instagram')) return 'instagram';
    
    return hostname;
  } catch {
    return 'direct';
  }
};

// Get IP and country using a free API
const getLocationData = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip || 'Unknown',
      country: data.country_code || 'WW'
    };
  } catch {
    return {
      ip: 'Unknown',
      country: 'WW'
    };
  }
};

export const useAnalyticsTracking = () => {
  const sessionId = getSessionId();

  const trackLinkClick = async (linkId: number, resultName: string, resultTitle: string, searchTerm?: string, isBlogClick: boolean = false) => {
    try {
      // Check if this link has been clicked in this session
      const { data: existing } = await supabase
        .from('click_analytics')
        .select('*')
        .eq('session_id', sessionId)
        .eq('link_id', linkId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        await supabase
          .from('click_analytics')
          .update({
            click_count: existing.click_count + 1,
            last_clicked_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Insert new record
        await supabase
          .from('click_analytics')
          .insert({
            session_id: sessionId,
            link_id: linkId,
            result_name: resultName,
            result_title: resultTitle,
            click_count: 1,
            search_term: searchTerm,
            is_blog_click: isBlogClick,
            last_clicked_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const startSession = async (page: string) => {
    try {
      // Check if session already exists
      const { data: existing } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (!existing) {
        const locationData = await getLocationData();
        const device = getDeviceType();
        const source = getSource();
        
        await supabase
          .from('session_analytics')
          .insert({
            session_id: sessionId,
            page,
            ip_address: locationData.ip,
            country: locationData.country,
            source,
            device,
            page_views: 1,
            start_time: new Date().toISOString()
          });
      } else {
        // Update page views count
        await supabase
          .from('session_analytics')
          .update({
            page_views: (existing.page_views || 1) + 1
          })
          .eq('session_id', sessionId);
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    try {
      const { data: session } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (session && !session.end_time) {
        const startTime = new Date(session.start_time).getTime();
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000);

        await supabase
          .from('session_analytics')
          .update({
            end_time: new Date().toISOString(),
            duration
          })
          .eq('session_id', sessionId);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return {
    trackLinkClick,
    startSession,
    endSession,
    sessionId
  };
};
