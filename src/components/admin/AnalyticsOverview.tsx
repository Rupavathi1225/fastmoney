import { BarChart3, Clock } from "lucide-react";

interface AnalyticsOverviewProps {
  totalClicks: number;
  totalSessions: number;
  avgSessionDuration: number;
}

const AnalyticsOverview = ({ totalClicks, totalSessions, avgSessionDuration }: AnalyticsOverviewProps) => {
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

  return (
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
        <p className="text-3xl font-bold text-foreground">{totalSessions}</p>
      </div>
      
      <div className="bg-card/30 rounded-lg p-6 border border-border">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">Avg Session Duration</h3>
        </div>
        <p className="text-3xl font-bold text-foreground">{formatDuration(avgSessionDuration)}</p>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
