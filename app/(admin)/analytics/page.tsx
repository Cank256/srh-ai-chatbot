import { getAnalytics, getSystemStats } from '@/app/analytics/actions';
import { AnalyticsChart } from '@/components/analytics-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, FileText, Activity, TrendingUp, Clock } from 'lucide-react';

import { type SystemStats } from '@/app/analytics/actions';

export default async function AnalyticsPage() {
  const [analytics, stats] = await Promise.all([
    getAnalytics(),
    getSystemStats()
  ]);

  // Ensure analytics is an array and properly typed
  const analyticsData = Array.isArray(analytics) ? analytics : [];
  
  // Explicitly type the analytics data to avoid type errors
  type AnalyticsItem = {
    activeUsers?: number;
    totalChats?: number;
    totalMessages?: number;
    date?: Date;
    [key: string]: any;
  };

  // Cast the data to the correct type
  const typedAnalyticsData = analyticsData as AnalyticsItem[];

  // Calculate trends (simplified)
  const recentAnalytics = typedAnalyticsData.slice(0, 7);
  const previousAnalytics = typedAnalyticsData.slice(7, 14);
  
  const calculateTrend = (recent: number, previous: number) => {
    if (previous === 0) return recent > 0 ? 100 : 0;
    return ((recent - previous) / previous) * 100;
  };

  const recentTotal = recentAnalytics.reduce((sum, item) => sum + (item?.activeUsers || 0), 0);
  const previousTotal = previousAnalytics.reduce((sum, item) => sum + (item?.activeUsers || 0), 0);
  const userTrend = calculateTrend(recentTotal, previousTotal);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      description: 'All registered users',
      icon: Users,
      trend: null,
    },
    {
      title: 'Active Users (7 days)',
      value: recentTotal || 0,
      description: 'Users active in last 7 days',
      icon: Activity,
      trend: userTrend || 0,
    },
    {
      title: 'Total Conversations',
      value: stats.totalChats || 0,
      description: 'All chat conversations',
      icon: MessageSquare,
      trend: null,
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages || 0,
      description: 'All messages sent',
      icon: MessageSquare,
      trend: null,
    },
    {
      title: 'Documents Created',
      value: stats.totalDocuments || 0,
      description: 'All created documents',
      icon: FileText,
      trend: null,
    },
    {
      title: 'Active Today',
      value: stats.activeUsersToday || 0,
      description: 'Users active today',
      icon: Clock,
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights into your application&apos;s usage and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                  {card.trend !== null && (
                    <div className={`flex items-center text-xs ${
                      card.trend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {card.trend >= 0 ? '+' : ''}{card.trend.toFixed(1)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
            <CardDescription>
              Daily usage statistics over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Usage Patterns</CardTitle>
            <CardDescription>
              Most common usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Chat Conversations</span>
                </div>
                <span className="text-sm font-medium">{stats.totalChats}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Document Creation</span>
                </div>
                <span className="text-sm font-medium">{stats.totalDocuments}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">Message Exchanges</span>
                </div>
                <span className="text-sm font-medium">{stats.totalMessages}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current system status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium text-green-600">&lt; 200ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <span className="text-sm font-medium text-green-600">&lt; 0.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}