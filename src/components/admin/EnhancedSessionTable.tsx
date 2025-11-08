import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ClickDetail {
  link_id: number;
  result_name: string;
  result_title: string;
  click_count: number;
  search_term?: string;
  is_blog_click: boolean;
  time_spent_seconds?: number;
}

interface SessionData {
  session_id: string;
  ip_address: string;
  country: string;
  source: string;
  device: string;
  page_views: number;
  start_time: string;
  end_time: string | null;
  clicks: ClickDetail[];
}

interface EnhancedSessionTableProps {
  data: SessionData[];
}

const EnhancedSessionTable = ({ data }: EnhancedSessionTableProps) => {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Active';
    return new Date(dateString).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRelatedCategories = (clicks: ClickDetail[]) => {
    // Group clicks by result_name (category)
    const categoryMap = new Map<string, { total: number; uniqueLinks: Set<number>; timeSpent: number }>();
    
    clicks.forEach(click => {
      const category = click.result_name;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { total: 0, uniqueLinks: new Set(), timeSpent: 0 });
      }
      const data = categoryMap.get(category)!;
      data.total += click.click_count;
      data.uniqueLinks.add(click.link_id);
      data.timeSpent += (click.time_spent_seconds || 0);
    });
    
    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      totalClicks: data.total,
      uniqueClicks: data.uniqueLinks.size,
      timeSpent: data.timeSpent
    }));
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getTotalClicks = (clicks: ClickDetail[]) => {
    return clicks.reduce((sum, click) => sum + click.click_count, 0);
  };

  const getUniqueClicks = (clicks: ClickDetail[]) => {
    const uniqueLinks = new Set(clicks.map(click => click.link_id));
    return uniqueLinks.size;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left py-3 px-3 text-sm font-semibold text-foreground">Session ID</th>
            <th className="text-left py-3 px-3 text-sm font-semibold text-foreground">IP Address</th>
            <th className="text-left py-3 px-3 text-sm font-semibold text-foreground">Country</th>
            <th className="text-left py-3 px-3 text-sm font-semibold text-foreground">Source</th>
            <th className="text-left py-3 px-3 text-sm font-semibold text-foreground">Device</th>
            <th className="text-center py-3 px-3 text-sm font-semibold text-foreground">Page Views</th>
            <th className="text-center py-3 px-3 text-sm font-semibold text-foreground">Total Clicks</th>
            <th className="text-center py-3 px-3 text-sm font-semibold text-foreground">Unique Clicks</th>
            <th className="text-center py-3 px-3 text-sm font-semibold text-foreground">Related Categories</th>
            <th className="text-left py-3 px-3 text-sm font-semibold text-foreground">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {data.map((session) => {
            const isExpanded = expandedSessions.has(session.session_id);
            const relatedCategories = getRelatedCategories(session.clicks);
            const totalClicks = getTotalClicks(session.clicks);
            const uniqueClicks = getUniqueClicks(session.clicks);

            return (
              <>
                <tr key={session.session_id} className="border-b border-border/50 hover:bg-accent/5">
                  <td className="py-3 px-3 text-foreground font-mono text-xs">
                    {session.session_id.substring(8, 18)}...
                  </td>
                  <td className="py-3 px-3 text-sm text-foreground">{session.ip_address || 'Unknown'}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                      {session.country || 'WW'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary/20 text-secondary-foreground">
                      {session.source || 'direct'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-sm text-foreground flex items-center gap-1">
                    {session.device === 'Desktop' && '💻'}
                    {session.device === 'Mobile' && '📱'}
                    {session.device === 'Tablet' && '📱'}
                    <span>{session.device || 'Unknown'}</span>
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-semibold text-foreground">
                    {session.page_views || 1}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
                      {totalClicks}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      {uniqueClicks}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {relatedCategories.length > 0 ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-400">
                          Total: {relatedCategories.reduce((sum, cat) => sum + cat.totalClicks, 0)}
                        </span>
                        <button
                          onClick={() => toggleSession(session.session_id)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          View breakdown
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(session.end_time || session.start_time)}
                  </td>
                </tr>
                
                {isExpanded && relatedCategories.length > 0 && (
                  <tr className="bg-accent/5">
                    <td colSpan={10} className="py-4 px-6">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Category Breakdown</h4>
                        <div className="space-y-2">
                          {relatedCategories.map((category, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-card rounded border border-border">
                              <span className="text-sm font-medium text-foreground">{category.name}</span>
                              <div className="flex gap-3 text-xs">
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                                  Total: {category.totalClicks}
                                </span>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded font-medium">
                                  Unique: {category.uniqueClicks}
                                </span>
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded font-medium">
                                  Time: {formatTimeSpent(category.timeSpent)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EnhancedSessionTable;