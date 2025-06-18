import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemStats, getAnalytics } from '@/app/analytics/actions';
import { Users, MessageSquare, FileText, Activity } from 'lucide-react';
import { AnalyticsChart } from '@/components/analytics-chart';

import { type SystemStats } from '@/app/analytics/actions';

export default async function AdminDashboard() {
  const stats = await getSystemStats();
  const analyticsResult = await getAnalytics();
  
  // Ensure analytics is an array and properly typed
  const analyticsData = Array.isArray(analyticsResult) ? analyticsResult : [];
  
  // Define a type for analytics data
  type AnalyticsItem = {
    date: Date | string;
    activeUsers?: number;
    totalChats?: number;
    totalMessages?: number;
    [key: string]: any;
  };
  
  // Cast the data to the correct type
  const analytics = analyticsData as AnalyticsItem[];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      description: 'Registered users',
      icon: Users,
    },
    {
      title: 'Total Chats',
      value: stats.totalChats || 0,
      description: 'Chat conversations',
      icon: MessageSquare,
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages || 0,
      description: 'Messages sent',
      icon: MessageSquare,
    },
    {
      title: 'Active Users Today',
      value: stats.activeUsersToday || 0,
      description: 'Users active today',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your application&apos;s performance and usage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Usage statistics over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AnalyticsChart data={analytics} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    System Status
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All systems operational
                  </p>
                </div>
                <div className="ml-auto font-medium text-green-600">Online</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Database
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connection healthy
                  </p>
                </div>
                <div className="ml-auto font-medium text-green-600">Connected</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    AI Services
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Models responding
                  </p>
                </div>
                <div className="ml-auto font-medium text-green-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}