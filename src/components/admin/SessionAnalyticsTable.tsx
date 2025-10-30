interface SessionData {
  session_id: string;
  page: string;
  start_time: string;
  end_time: string | null;
  duration: number;
}

interface SessionAnalyticsTableProps {
  data: SessionData[];
}

const SessionAnalyticsTable = ({ data }: SessionAnalyticsTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Active';
    return new Date(dateString).toLocaleString();
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

  return (
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
          {data.map((session) => (
            <tr key={session.session_id} className="border-b border-border/50 hover:bg-card/20">
              <td className="py-3 px-4 text-foreground font-mono text-sm">
                {session.session_id.slice(0, 20)}...
              </td>
              <td className="py-3 px-4">
                <span className="text-primary font-mono">/{session.page}</span>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(session.start_time)}
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(session.end_time)}
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
  );
};

export default SessionAnalyticsTable;
