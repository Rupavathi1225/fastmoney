import { useState, useEffect } from "react";
import { getClickAnalytics, getSessionAnalytics, clearClickAnalytics, clearSessionAnalytics } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Trash2, BarChart3, Clock } from "lucide-react";
import { toast } from "sonner";

const AnalyticsTab = () => {
  const [clickAnalytics, setClickAnalytics] = useState(getClickAnalytics());
  const [sessionAnalytics, setSessionAnalytics] = useState(getSessionAnalytics());

  useEffect(() => {
    const interval = setInterval(() => {
      setClickAnalytics(getClickAnalytics());
      setSessionAnalytics(getSessionAnalytics());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClearClickAnalytics = () => {
    if (confirm("Are you sure you want to clear all click analytics?")) {
      clearClickAnalytics();
      setClickAnalytics([]);
      toast.success("Click analytics cleared!");
    }
  };

  const handleClearSessionAnalytics = () => {
    if (confirm("Are you sure you want to clear all session analytics?")) {
      clearSessionAnalytics();
      setSessionAnalytics([]);
      toast.success("Session analytics cleared!");
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalClicks = clickAnalytics.reduce((sum, item) => sum + item.clicks, 0);
  const avgSessionDuration = sessionAnalytics.length > 0 
    ? Math.floor(sessionAnalytics.reduce((sum, item) => sum + item.duration, 0) / sessionAnalytics.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalClicks}</p>
        </div>
        
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{sessionAnalytics.length}</p>
        </div>
        
        <div className="bg-card/30 rounded-lg p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Avg Session Duration</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{formatDuration(avgSessionDuration)}</p>
        </div>
      </div>

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Link ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Clicked</th>
                </tr>
              </thead>
              <tbody>
                {clickAnalytics.sort((a, b) => b.clicks - a.clicks).map((item) => (
                  <tr key={item.lid} className="border-b border-border/50 hover:bg-card/20">
                    <td className="py-3 px-4">
                      <span className="text-primary font-mono">lid={item.lid}</span>
                    </td>
                    <td className="py-3 px-4 text-foreground">{item.resultName}</td>
                    <td className="py-3 px-4 text-foreground">{item.resultTitle}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                        {item.clicks}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(item.lastClickedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Session ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Page</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Time</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessionAnalytics.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).map((session) => (
                  <tr key={session.id} className="border-b border-border/50 hover:bg-card/20">
                    <td className="py-3 px-4 text-foreground font-mono text-sm">
                      #{session.id.slice(-6)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-primary font-mono">/{session.page}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(session.startTime)}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(session.endTime)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                        {formatDuration(session.duration)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
