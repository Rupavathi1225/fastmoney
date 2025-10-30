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

export const useAnalyticsTracking = () => {
  const sessionId = getSessionId();

  const trackLinkClick = async (linkId: number, resultName: string, resultTitle: string) => {
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
        await supabase
          .from('session_analytics')
          .insert({
            session_id: sessionId,
            page,
            start_time: new Date().toISOString()
          });
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
