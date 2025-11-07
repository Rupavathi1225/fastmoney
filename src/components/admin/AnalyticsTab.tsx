import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import AnalyticsOverview from "./AnalyticsOverview";
import EnhancedSessionTable from "./EnhancedSessionTable";

const AnalyticsTab = () => {
  const [sessionAnalytics, setSessionAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [countries, setCountries] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  const fetchAnalytics = async () => {
    try {
      let sessionQuery = supabase
        .from('session_analytics')
        .select('*')
        .order('start_time', { ascending: false });

      if (countryFilter !== "all") {
        sessionQuery = sessionQuery.eq('country', countryFilter);
      }
      if (sourceFilter !== "all") {
        sessionQuery = sessionQuery.eq('source', sourceFilter);
      }

      const { data: sessions } = await sessionQuery;

      // Fetch all clicks
      const { data: clicks } = await supabase
        .from('click_analytics')
        .select('*');

      // Group clicks by session
      const clicksBySession: Record<string, any[]> = {};
      clicks?.forEach(click => {
        if (!clicksBySession[click.session_id]) {
          clicksBySession[click.session_id] = [];
        }
        clicksBySession[click.session_id].push(click);
      });

      // Combine sessions with their clicks
      const sessionsWithClicks = sessions?.map(session => ({
        ...session,
        clicks: clicksBySession[session.session_id] || []
      })) || [];

      setSessionAnalytics(sessionsWithClicks);

      // Extract unique countries and sources for filters
      const uniqueCountries = [...new Set(sessions?.map(s => s.country).filter(Boolean))];
      const uniqueSources = [...new Set(sessions?.map(s => s.source).filter(Boolean))];
      setCountries(uniqueCountries as string[]);
      setSources(uniqueSources as string[]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [countryFilter, sourceFilter]);

  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [countryFilter, sourceFilter]);

  const handleClearAllAnalytics = async () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      try {
        await supabase.from('click_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('session_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        setSessionAnalytics([]);
        toast.success("All analytics cleared!");
      } catch (error) {
        toast.error("Failed to clear analytics");
      }
    }
  };

  const totalClicks = sessionAnalytics.reduce((sum, session) => {
    const sessionClicks = session.clicks?.filter((c: any) => !c.is_blog_click).reduce((s: number, c: any) => s + c.click_count, 0) || 0;
    return sum + sessionClicks;
  }, 0);
  
  const totalPageViews = sessionAnalytics.reduce((sum, session) => sum + (session.page_views || 1), 0);
  
  const avgSessionDuration = sessionAnalytics.length > 0 
    ? Math.floor(sessionAnalytics.reduce((sum, item) => sum + (item.duration || 0), 0) / sessionAnalytics.length)
    : 0;

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-foreground">{sessionAnalytics.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Unique visitors tracked</p>
        </div>
        
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Page Views</h3>
          <p className="text-3xl font-bold text-foreground">{totalPageViews}</p>
          <p className="text-xs text-muted-foreground mt-1">Total pages viewed</p>
        </div>
        
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-foreground">{totalClicks}</p>
          <p className="text-xs text-muted-foreground mt-1">Buttons and links clicked</p>
        </div>
        
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Session Duration</h3>
          <p className="text-3xl font-bold text-foreground">
            {avgSessionDuration > 60 ? `${Math.floor(avgSessionDuration / 60)}m` : `${avgSessionDuration}s`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Average time per session</p>
        </div>
      </div>

      <div className="bg-card/30 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Session Analytics</h2>
          <Button 
            onClick={handleClearAllAnalytics}
            variant="destructive"
            size="sm"
            disabled={sessionAnalytics.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Country</label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Source</label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {sessionAnalytics.length > 0 ? (
          <EnhancedSessionTable data={sessionAnalytics} />
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
