import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemStats, getAnalytics } from '@/lib/db/queries';
import { Users, MessageSquare, FileText, Activity } from 'lucide-react';
import { AnalyticsChart } from '@/components/analytics-chart';

export default async function AdminDashboard() {
  const stats = await getSystemStats();
  const analytics = await getAnalytics();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
    },
    {
      title: 'Total Chats',
      value: stats.totalChats,
      description: 'Chat conversations',
      icon: MessageSquare,
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      description: 'Messages sent',
      icon: MessageSquare,
    },
    {
      title: 'Active Users Today',
      value: stats.activeUsersToday,
      description: 'Users active today',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your application's performance and usage.
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