interface ClickData {
  session_id: string;
  link_id: number;
  result_name: string;
  result_title: string;
  click_count: number;
  last_clicked_at: string;
}

interface ClickAnalyticsTableProps {
  data: ClickData[];
}

const ClickAnalyticsTable = ({ data }: ClickAnalyticsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Group by session and calculate totals
  const sessionGroups = data.reduce((acc, item) => {
    if (!acc[item.session_id]) {
      acc[item.session_id] = [];
    }
    acc[item.session_id].push(item);
    return acc;
  }, {} as Record<string, ClickData[]>);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Session ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Link ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Clicks</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Clicked</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(sessionGroups).map(([sessionId, clicks]) => (
            clicks.map((item, index) => (
              <tr key={`${sessionId}-${item.link_id}`} className="border-b border-border/50 hover:bg-card/20">
                {index === 0 && (
                  <td 
                    rowSpan={clicks.length} 
                    className="py-3 px-4 text-foreground font-mono text-sm border-r border-border/50 bg-card/10"
                  >
                    {sessionId.slice(0, 15)}...
                  </td>
                )}
                <td className="py-3 px-4">
                  <span className="text-primary font-mono">lid={item.link_id}</span>
                </td>
                <td className="py-3 px-4 text-foreground">{item.result_name}</td>
                <td className="py-3 px-4 text-foreground">{item.result_title}</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                    {item.click_count}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {formatDate(item.last_clicked_at)}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClickAnalyticsTable;
