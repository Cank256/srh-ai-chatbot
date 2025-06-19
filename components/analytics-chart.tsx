'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';

// Define a more flexible type for analytics data
type AnalyticsData = {
  date?: Date | string;
  activeUsers?: number;
  totalChats?: number;
  totalMessages?: number;
  [key: string]: any;
};

interface AnalyticsChartProps {
  data: AnalyticsData[] | any[] | undefined;
}

export function AnalyticsChart({ data = [] }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, 30).reverse().map((item) => ({
      date: item.date ? format(new Date(item.date), 'MMM dd') : 'Unknown',
      users: item.activeUsers || 0,
      chats: item.totalChats || 0,
      messages: item.totalMessages || 0,
    }));
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(
      ...chartData.map((item) => Math.max(item.users, item.chats, item.messages))
    );
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <div className="flex h-full items-end justify-between gap-2">
        {chartData.map((item, index) => {
          const userHeight = (item.users / maxValue) * 160;
          const chatHeight = (item.chats / maxValue) * 160;
          const messageHeight = (item.messages / maxValue) * 160;
          
          return (
            <div key={index} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-1 h-40">
                <div
                  className="bg-blue-500 rounded-t w-2 min-h-[2px]"
                  style={{ height: `${userHeight}px` }}
                  title={`Users: ${item.users}`}
                />
                <div
                  className="bg-green-500 rounded-t w-2 min-h-[2px]"
                  style={{ height: `${chatHeight}px` }}
                  title={`Chats: ${item.chats}`}
                />
                <div
                  className="bg-purple-500 rounded-t w-2 min-h-[2px]"
                  style={{ height: `${messageHeight}px` }}
                  title={`Messages: ${item.messages}`}
                />
              </div>
              <span className="text-xs text-muted-foreground -rotate-45 origin-center">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="size-3 bg-blue-500 rounded" />
          <span>Users</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 bg-green-500 rounded" />
          <span>Chats</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 bg-purple-500 rounded" />
          <span>Messages</span>
        </div>
      </div>
    </div>
  );
}