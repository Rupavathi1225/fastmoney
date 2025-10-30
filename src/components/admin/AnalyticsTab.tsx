import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import AnalyticsOverview from "./AnalyticsOverview";
import ClickAnalyticsTable from "./ClickAnalyticsTable";
import SessionAnalyticsTable from "./SessionAnalyticsTable";

const AnalyticsTab = () => {
  const [clickAnalytics, setClickAnalytics] = useState<any[]>([]);
  const [sessionAnalytics, setSessionAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const { data: clicks } = await supabase
        .from('click_analytics')
        .select('*')
        .order('last_clicked_at', { ascending: false });

      const { data: sessions } = await supabase
        .from('session_analytics')
        .select('*')
        .order('start_time', { ascending: false });

      setClickAnalytics(clicks || []);
      setSessionAnalytics(sessions || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    const interval = setInterval(fetchAnalytics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClearClickAnalytics = async () => {
    if (confirm("Are you sure you want to clear all click analytics?")) {
      try {
        await supabase.from('click_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        setClickAnalytics([]);
        toast.success("Click analytics cleared!");
      } catch (error) {
        toast.error("Failed to clear click analytics");
      }
    }
  };

  const handleClearSessionAnalytics = async () => {
    if (confirm("Are you sure you want to clear all session analytics?")) {
      try {
        await supabase.from('session_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        setSessionAnalytics([]);
        toast.success("Session analytics cleared!");
      } catch (error) {
        toast.error("Failed to clear session analytics");
      }
    }
  };

  const totalClicks = clickAnalytics.reduce((sum, item) => sum + item.click_count, 0);
  const avgSessionDuration = sessionAnalytics.length > 0 
    ? Math.floor(sessionAnalytics.reduce((sum, item) => sum + item.duration, 0) / sessionAnalytics.length)
    : 0;

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <AnalyticsOverview 
        totalClicks={totalClicks}
        totalSessions={sessionAnalytics.length}
        avgSessionDuration={avgSessionDuration}
      />

      {/* Click Analytics */}
      <div className="bg-card/30 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Link Click Analytics</h2>
          <Button 
            onClick={handleClearClickAnalytics}
            variant="destructive"
            size="sm"
            disabled={clickAnalytics.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </div>

        {clickAnalytics.length > 0 ? (
          <ClickAnalyticsTable data={clickAnalytics} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No click data yet. Clicks will be tracked when users visit links.</p>
          </div>
        )}
      </div>

      {/* Session Analytics */}
      <div className="bg-card/30 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Session Analytics</h2>
          <Button 
            onClick={handleClearSessionAnalytics}
            variant="destructive"
            size="sm"
            disabled={sessionAnalytics.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </div>

        {sessionAnalytics.length > 0 ? (
          <SessionAnalyticsTable data={sessionAnalytics} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No session data yet. Sessions will be tracked when users visit pages.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;
